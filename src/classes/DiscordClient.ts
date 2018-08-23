import {
	Client,
	Guild,
	GuildMember,
	Message,
	Snowflake,
	TextChannel,
} from 'discord.js'
import { prefix } from '../constants'
import {
	announceEntry,
	announceExit,
	dareEM,
	deleteEM,
	scoldEM,
} from '../discord/featureEnum'
import { initAutoPurge } from '../features/channelAutoPurge'
import { isPrefixed } from '../util/string'
import { injectHandler } from '../util/tools'
import { Main } from './Main'

const defaultInjection = { Client }
const clientOptions = { fetchAllMembers: true }

export class DiscordClient {
	private get list() {
		return this.app.list
	}

	private get music() {
		return this.app.music
	}
	private get logger() {
		return this.app.logger
	}

	readonly client: Client

	constructor(private app: Main, injects = {}) {
		const { Client } = injectHandler(defaultInjection, injects)

		const client = (this.client = new Client(clientOptions))

		client.on('ready', () => this.ready())
		client.on('error', error => this.error(error))
		client.on('disconnect', () => this.disconnect())
		client.on('reconnecting', () => this.reconnecting())
		client.on('message', message => this.messageRecived(message))
		client.on('guildMemberAdd', member => this.guildMemberAdd(member))
		client.on('guildMemberRemove', member => this.guildMemberRemove(member))
	}

	login(token: string) {
		return this.client.login(token)
	}

	destroy() {
		return this.client.destroy()
	}

	async ready() {
		const invite = await this.client.generateInvite()

		this.logger.log('Discord client is ready!\n' + 'Bot invite: ' + invite)
		initAutoPurge(this.app)
	}

	disconnect = () => this.logger.log('Discord client has disconnected')

	reconnecting = () => this.logger.log('Discord client is reconnecting')

	error(err: any) {
		this.logger.error('A Discord error occured')
		this.logger.error(err)
	}

	async messageRecived(message: Message) {
		const text = message.content.trim()

		if (message.author.bot) {
			return
		}

		const mentionPrefix = `<@!${this.client.user.id}> `
		const musicPrefix = "'"

		try {
			if (isPrefixed(prefix, text)) {
				await this.list.run(this.app, message, text, prefix)
			} else if (isPrefixed(mentionPrefix, text)) {
				await this.list.run(this.app, message, text, mentionPrefix)
			} else if (isPrefixed(musicPrefix, text)) {
				await this.music.run(this.app, message, text, musicPrefix)
			} else if (message.mentions.everyone) {
				await this.everyoneResponse(message)
			}
		} catch (error) {
			await this.logger.log(
				'An error occured in hanndling messages',
				error
			)
		}
	}

	guildMemberAdd(member: GuildMember) {
		this.logger.log(member)
		this.defaultChannelMessage(
			member.guild,
			`Welcome to the server, ${member}!`,
			announceEntry
		)
	}

	guildMemberRemove(member: GuildMember) {
		this.defaultChannelMessage(
			member.guild,
			`${member} has left!`,
			announceExit
		)
	}

	isFeatureEnabled(guild: Guild | Snowflake, feature: string) {
		return this.app.database.isFeatureEnabled(guild, feature)
	}

	private async defaultChannelMessage(
		guild: Guild,
		message: string,
		feature: string
	) {
		const isEnabled = await this.isFeatureEnabled(guild, feature)

		if (!isEnabled) {
			return
		}

		const channel = await this.getDefaultChannel(guild)

		if (!channel) {
			return
		}

		channel.send(message)
	}

	private async getDefaultChannel(guild: Guild): Promise<TextChannel> {
		const config = await this.app.database.findGuildConfig(guild)

		if (!config) {
			return
		}

		const { defaultChannel } = config
		const channel = guild.channels.find(
			ch => ch.id === String(defaultChannel)
		)

		if (channel && channel instanceof TextChannel) {
			return channel
		}
	}

	private async everyoneResponse(message: Message) {
		const { guild, deletable } = message
		const isDeleting = await this.isFeatureEnabled(guild, deleteEM)
		const isScolding = await this.isFeatureEnabled(guild, scoldEM)

		if (deletable && isDeleting) {
			await message.delete()
		}

		if (isScolding) {
			const file = (await this.isFeatureEnabled(guild, dareEM))
				? { file: 'https://cdn.weeb.sh/images/ryKLMPEj-.png' }
				: undefined

			await message.reply("Don't mention everyone!!", file)
		}
	}
}
