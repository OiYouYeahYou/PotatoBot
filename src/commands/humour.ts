import { Message } from 'discord.js'
import list from '../list'

list.addCommand( 'shutup', {
	func: async ( message: Message ) =>
		message.reply( 'Bitch Noooo!!!!' ),
	help: 'Returns a witty response',
} )
