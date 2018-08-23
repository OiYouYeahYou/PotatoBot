import { Message } from 'discord.js'
import { destructingReply } from '../discord/discordHelpers'
import { randomString } from '../util/string'
import AbstractListItem from './AbstractListItem'
import { SelfSendingEmbed } from './Embed'
import List from './List'
import { Main } from './Main'

interface ITrace {
	wrapper: AbstractListItem
	command: string
}

export default class Request {
	private stackTrace: ITrace[] = []

	constructor(
		readonly app: Main,
		readonly list: List,
		private readonly message: Message,
		readonly prefix: string,
		readonly text: string
	) {}

	get guild() {
		return this.message.guild
	}
	get channel() {
		return this.message.channel
	}
	get member() {
		return this.message.member
	}
	get author() {
		return this.message.author
	}
	get client() {
		return this.message.client
	}
	get bot() {
		return this.client.user
	}

	get screenname() {
		return this.message.member.nickname || this.message.author.username
	}

	get topTrace() {
		return this.stackTrace[0]
	}

	get wrapper() {
		return this.topTrace && this.topTrace.wrapper
	}

	get logger() {
		return this.app.logger
	}

	addTrace(command: string, wrapper: AbstractListItem) {
		this.stackTrace.push({ wrapper, command })
	}

	async send(text: any, options?: any) {
		const message = await this.message.channel.send(text, options)
		return Array.isArray(message) ? message[0] : message
	}

	async reply(text: any, options?: any) {
		return this.message.reply(text, options)
	}

	async destructingReply(text: string) {
		return destructingReply(this.message, text)
	}

	async delete() {
		if (this.message.deletable) {
			return this.message.delete()
		}
	}

	async somethingWentWrong(err: any) {
		const id = randomString(6)

		if (err instanceof Error) {
			err.message += ` (Event: ${id})`
		}

		this.logger.log(err)
		return this.destructingReply(`Something went wrong (Event: ${id})`)
	}

	embed() {
		return new SelfSendingEmbed(this)
	}

	usage(message?: string) {
		const commands = this.stackTrace.map(({ command }) => command)
		const usage = this.wrapper.getUsage(this.prefix, commands)
		const response = `${message ? message : 'Usage'}: ${usage}`

		this.send(response)
	}
}
