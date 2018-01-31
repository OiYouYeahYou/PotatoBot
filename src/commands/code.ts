import { Message } from "discord.js";
import { splitByFirstSpace, destructingReply, somethingWentWrong } from "../util";
import { list } from "../commands";

list.Command( 'code', {
	func: async ( message: Message, args: string ) => {
		const [ lang, text ] = splitByFirstSpace( args );

		return sendCode( message, text, lang );
	},
	help: 'Sends an text formatted in specified language',
	usage: '<code snippet>',
} );

list.Command( 'js', {
	func: async ( message: Message, args: string ) =>
		sendCode( message, args, 'javascript' ),
	help: 'Sends an text formatted as javascript',
	usage: '<code snippet>',
} );

list.Command( 'ruby', {
	func: async ( message: Message, args: string ) =>
		sendCode( message, args, 'ruby' ),
	help: 'Sends an text formatted as ruby',
	usage: '<code snippet>',
} );

async function sendCode( message: Message, text: string | undefined, lang ) {
	if ( message.delete )
		await message.delete();

	if ( !text || !text.trim() )
		return destructingReply( message, 'No code was recieved' )

	return message.channel.sendCode( lang, text );
}
