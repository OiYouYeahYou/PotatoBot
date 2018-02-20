import { Message, Guild, Channel, GuildMember, User, Client, GuildChannel, TextBasedChannel, TextChannel, GroupDMChannel, DMChannel } from "discord.js";
import { destructingReply, somethingWentWrong } from "../util";


export default class Request
{
	constructor( message: Message, prefix: string, text: string )
	{
		this.message = message
	}

	readonly message: Message

	get guild()
	{
		return this.message.guild
	}
	get channel()
	{
		return this.message.channel
	}
	get member()
	{
		return this.message.member
	}
	get author()
	{
		return this.message.author
	}
	get client()
	{
		return this.message.client
	}

	async send( text, options?: any )
	{
		return await this.message.channel.send( text, options )
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
}
