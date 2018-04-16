import { Message } from "discord.js"
import { destructingReply, somethingWentWrong } from "../util"
import { Main } from "./Main"
import List from "./List"
import { SelfSendingEmbed } from "./Embed"


export default class Request
{
	constructor(
		app: Main,
		list: List,
		message: Message,
		prefix: string,
		text: string
	)
	{
		this.app = app
		this.list = list
		this.message = message
		this.prefix = prefix
		this.text = text
	}

	readonly app: Main
	readonly list: List
	readonly message: Message
	readonly prefix: string
	readonly text: string

	get guild() { return this.message.guild }
	get channel() { return this.message.channel }
	get member() { return this.message.member }
	get author() { return this.message.author }
	get client() { return this.message.client }
	get bot() { return this.client.user }
	get voiceConnection() { return this.guild.voiceConnection }

	get screenname()
	{
		return this.message.member.nickname || this.message.author.username
	}

	async send( text, options?: any )
	{
		const message = await this.message.channel.send( text, options )
		return Array.isArray( message ) ? message[ 0 ] : message
	}

	async sendCode( lang: string, content: any, options?: any )
	{
		return await this.message.channel.sendCode( lang, content )
	}

	async reply( text, options?: any )
	{
		return await this.message.reply( text, options )
	}

	async destructingReply( text: string )
	{
		return await destructingReply( this.message, text )
	}

	async delete()
	{
		if ( this.message.deletable )
			return await this.message.delete()
	}

	async somethingWentWrong( err )
	{
		return somethingWentWrong( this.message, err )
	}

	embed()
	{
		return new SelfSendingEmbed( this )
	}
}
