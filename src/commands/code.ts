import { Message } from 'discord.js'
import { splitByFirstSpace, destructingReply, somethingWentWrong } from '../util'
import List from '../classes/List';

export default function ( list: List )
{
	list.addCommand( 'code', {
		func: async ( message: Message, args: string ) =>
		{
			const [ lang, text ] = splitByFirstSpace( args )

			return sendCode( message, text, lang )
		},
		help: 'Sends text formatted in specified language',
		usage: '<code snippet>',
	} )

	list.addCommand( 'js', {
		func: async ( message: Message, args: string ) =>
			sendCode( message, args, 'javascript' ),
		help: 'Sends text formatted as javascript',
		usage: '<code snippet>',
	} )

	list.addCommand( 'ruby', {
		func: async ( message: Message, args: string ) =>
			sendCode( message, args, 'ruby' ),
		help: 'Sends text formatted as ruby',
		usage: '<code snippet>',
	} )
}


async function sendCode( message: Message, text: string | undefined, lang )
{
	if ( message.delete )
		await message.delete()

	if ( !text || !text.trim() )
		return destructingReply( message, 'No code was recieved' )

	return message.channel.sendCode( lang, text )
}
