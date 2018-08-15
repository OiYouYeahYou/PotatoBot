import { Message, RichEmbed } from 'discord.js'
import Request from './Request'

export default class Embed extends RichEmbed {
	constructor() {
		super()

		this.setAuthor('Potato Bot')
			.setColor(0x00ae86)
			.setFooter('Much love, your friendly neighbourhood bot')
	}
}

export class SelfSendingEmbed extends Embed {
	readonly send: () => Promise<Message>

	constructor(req: Request) {
		super()

		this.send = () => req.send(this)
	}
}
