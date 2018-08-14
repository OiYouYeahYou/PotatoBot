import { Client, Message, Guild, GuildMember, TextChannel, Snowflake } from 'discord.js'
import { Main } from './Main'
import { initAutoPurge } from '../features/channelAutoPurge'
import { somethingWentWrong } from '../discord/discordHelpers'
import { isPrefixed } from '../util/string'
import { prefix } from '../constants'
import { announceExit, announceEntry, deleteEM, scoldEM, dareEM } from '../discord/featureEnum'
import { injectHandler } from '../util/tools';

const defaultInjection = { Client, }

export class DiscordClient
{
	readonly client: Client

	constructor( private app: Main, injects = {} )
	{
		const { Client } = injectHandler( defaultInjection, injects )

		const clientOptions = { fetchAllMembers: true }

		const client = this.client = new Client( clientOptions )

		client.on( 'ready', () => this.ready() )
		client.on( 'error', this.error )
		client.on( 'disconnect', this.disconnect )
		client.on( 'reconnecting', this.reconnecting )
		client.on( 'message', ( message ) => this.messageRecived( message ) )
		client.on( 'guildMemberAdd', this.guildMemberAdd )
		client.on( 'guildMemberRemove', this.guildMemberRemove )
	}

	private get list()
	{
		return this.app.list
	}

	private get music()
	{
		return this.app.music
	}

	login( token: string )
	{
		return this.client.login( token )
	}

	destroy()
	{
		return this.client.destroy()
	}

	async ready()
	{
		const invite = await this.client.generateInvite()

		console.log(
			'Discord client is ready!\n'
			+ 'Bot invite: ' + invite
		)
		initAutoPurge( this.app )
	}

	disconnect = () =>
		console.log( 'Discord client has disconnected' )

	reconnecting = () =>
		console.log( 'Discord client is reconnecting' )

	error( err: any )
	{
		console.error( 'A Discord error occured' )
		console.error( err )
	}

	async messageRecived( message: Message )
	{
		const text = message.content.trim()

		if ( message.author.bot )
			return

		const mentionPrefix = `<@!${ this.client.user.id }> `
		const musicPrefix = '\\'

		try
		{
			if ( isPrefixed( prefix, text ) )
				await this.list.run( this.app, message, text, prefix )
			else if ( isPrefixed( mentionPrefix, text ) )
				await this.list.run( this.app, message, text, mentionPrefix )
			else if ( isPrefixed( musicPrefix, text ) )
				await this.music.run( this.app, message, text, musicPrefix )
			else if ( message.mentions.everyone )
				await this.everyoneResponse( message )
		}
		catch ( error )
		{
			await somethingWentWrong( message, error )
		}
	}

	guildMemberAdd( member: GuildMember )
	{
		console.log( member );
		this.defaultChannelMessage(
			member.guild,
			`Welcome to the server, ${ member }!`,
			announceEntry
		)
	}

	guildMemberRemove( member: GuildMember )
	{
		this.defaultChannelMessage(
			member.guild,
			`${ member } has left!`,
			announceExit
		)
	}

	private async defaultChannelMessage(
		guild: Guild,
		message: string,
		feature: string
	)
	{
		const isEnabled = await this.isFeatureEnabled( guild, feature )

		if ( !isEnabled )
			return

		const channel = await this.getDefaultChannel( guild )

		if ( !channel )
			return

		channel.send( message )
	}

	private async getDefaultChannel( guild: Guild ): Promise<TextChannel>
	{
		const config = await this.app._database.findGuildConfig( guild )

		if ( !config )
			return

		const { defaultChannel } = config
		const channel = guild.channels.find(
			ch => ch.id === String( defaultChannel )
		)

		if ( channel && channel instanceof TextChannel )
			return channel
	}

	private async everyoneResponse( message: Message )
	{
		const { guild, deletable } = message
		const isDeleting = await this.isFeatureEnabled( guild, deleteEM )
		const isScolding = await this.isFeatureEnabled( guild, scoldEM )

		if ( deletable && isDeleting )
			await message.delete()

		if ( isScolding )
		{
			const file = await this.isFeatureEnabled( guild, dareEM )
				? { file: 'https://cdn.weeb.sh/images/ryKLMPEj-.png', }
				: undefined

			await message.reply( 'Don\'t mention everyone!!', file )
		}
	}

	isFeatureEnabled( guild: Guild | Snowflake, feature: string )
	{
		return this.app._database.isFeatureEnabled( guild, feature )
	}
}
