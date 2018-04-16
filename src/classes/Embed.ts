import { RichEmbed, Message } from "discord.js";
import Request from "./Request";


export default class Embed extends RichEmbed
{
	constructor()
	{
		super()

		this.setAuthor( 'Potato Bot' )
			.setColor( 0x00AE86 )
			.setFooter( 'Much love, your friendly neighbourhood bot' )
	}
}

export class SelfSendingEmbed extends Embed
{
	constructor( req: Request )
	{
		super()

		this.send = () => req.send( this )
	}

	readonly send: () => Promise<Message>
}
