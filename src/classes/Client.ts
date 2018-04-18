import { Client, Message, Guild, GuildMember } from 'discord.js'
import { Main } from './Main'
import { initAutoPurge } from '../features/channelAutoPurge'
import { isPrefixed, somethingWentWrong } from '../util'
import { prefix } from '../constants'
import { music } from '../discord/music'
import { everyoneResponse } from '../discord/features'
import { isFeatureEnabled, getDefaultChannel } from '../configManager'
import { announceExit, announceEntry } from '../discord/featureEnum'

export class Bot
{
	constructor( app: Main )
	{
		const clientOptions = { fetchAllMembers: true }

		const client = this.client = new Client( clientOptions )

		client.on( 'ready', () => this.ready( client ) )
		client.on( 'error', this.error )
		client.on( 'disconnect', this.disconnect )
		client.on( 'reconnecting', this.reconnecting )
		client.on( 'message', message => this.messageRecived( app, message ) )
		client.on( 'guildMemberAdd', this.guildMemberAdd )
		client.on( 'guildMemberRemove', this.guildMemberRemove )
	}

	readonly client: Client

	login( token: string )
	{
		return this.client.login( token )
	}

	destroy()
	{
		return this.client.destroy()
	}

	async ready( client: Client )
	{
		const invite = await client.generateInvite()

		console.log(
			'Discord client is ready!\n'
			+ 'Bot invite: ' + invite
		)
		initAutoPurge( client )
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

	async messageRecived( app: Main, message: Message )
	{
		const text = message.content.trim()

		if ( message.author.bot )
			return

		const mentionPrefix = `<@!${ app.bot.client.user.id }> `
		const musicPrefix = '\\'

		try
		{
			if ( isPrefixed( prefix, text ) )
				await app.list.run( app, message, text, prefix )
			else if ( isPrefixed( mentionPrefix, text ) )
				await app.list.run( app, message, text, mentionPrefix )
			else if ( isPrefixed( musicPrefix, text ) )
				await music.run( app, message, text, musicPrefix )
			else if ( message.mentions.everyone )
				await everyoneResponse( message )
		}
		catch ( error )
		{
			await somethingWentWrong( message, error )
		}
	}

	guildMemberAdd( member: GuildMember )
	{
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
		const isEnabled = await isFeatureEnabled( guild, feature )

		if ( !isEnabled )
			return

		const channel = await getDefaultChannel( guild )

		if ( !channel )
			return

		channel.send( message )
	}
}
