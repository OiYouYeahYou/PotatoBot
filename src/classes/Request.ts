import { Message } from "discord.js"
import { destructingReply, somethingWentWrong } from "../discord/discordHelpers"
import { Main } from "./Main"
import List from "./List"
import { SelfSendingEmbed } from "./Embed"


export default class Request
{
	constructor(
		readonly app: Main,
		readonly list: List,
		private readonly message: Message,
		readonly prefix: string,
		readonly text: string
	) { }

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

	async send( text: any, options?: any )
	{
		const message = await this.message.channel.send( text, options )
		return Array.isArray( message ) ? message[ 0 ] : message
	}

	async reply( text: any, options?: any )
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

	async somethingWentWrong( err: any )
	{
		return somethingWentWrong( this.message, err )
	}

	embed()
	{
		return new SelfSendingEmbed( this )
	}
}
