import { Message } from "discord.js";
import { splitByFirstSpace } from "../util";

export const WrapperCode = {
	func: ( message: Message, args: string ) => {
		var [ lang, text ] = splitByFirstSpace( args );

		sendCode( message, text, lang );
	},
	help: 'Sends an text formatted in specified language',
	usage: '<code snippet>',
};

export const WrapperJS = {
	func: ( message: Message, args: string ) => {
		sendCode( message, args, 'javascript' );
	},
	help: 'Sends an text formatted as javascript',
	usage: '<code snippet>',
};

export const WrapperRuby = {
	func: ( message: Message, args: string ) => {
		sendCode( message, args, 'ruby' );
	},
	help: 'Sends an text formatted as ruby',
	usage: '<code snippet>',
};

function sendCode( message: Message, text, lang ) {
	if ( message.delete )
		message.delete();

	message.channel.sendCode( lang, text );
}
