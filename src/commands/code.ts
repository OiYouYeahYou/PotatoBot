import { Message } from "discord.js";
import { splitByFirstSpace, destructingReply, somethingWentWrong } from "../util";

export const WrapperCode = {
	func: ( message: Message, args: string ) => {
		var [ lang, text ] = splitByFirstSpace( args );

		sendCode( message, text, lang );
	},
	help: 'Sends an text formatted in specified language',
	usage: '<code snippet>',
};

export const WrapperJS = {
	func: ( message: Message, args: string ) =>
		sendCode( message, args, 'javascript' ),
	help: 'Sends an text formatted as javascript',
	usage: '<code snippet>',
};

export const WrapperRuby = {
	func: ( message: Message, args: string ) =>
		sendCode( message, args, 'ruby' ),
	help: 'Sends an text formatted as ruby',
	usage: '<code snippet>',
};

function sendCode( message: Message, text: string | undefined, lang ) {
	if ( message.delete )
		message.delete();

	if ( !text || !text.trim() )
		return destructingReply( message, 'No code was recieved' )

	message.channel.sendCode( lang, text )
		.catch( err => somethingWentWrong( message, err ) );
}
