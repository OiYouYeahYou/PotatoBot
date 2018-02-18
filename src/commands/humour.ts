import { Message } from 'discord.js'
import List from '../classes/List';


export default function ( list: List )
{
	list.addCommand( 'shutup', {
		func: async ( message: Message ) =>
			message.reply( 'Bitch Noooo!!!!' ),
		help: 'Returns a witty response',
	} )
}

