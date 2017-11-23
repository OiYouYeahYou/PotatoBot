import { Message } from "discord.js";

export const WrapperJS = {
	func: ( message: Message, args: string ) => {
		sendCode( message, args, 'javascript' );
	}
};

function sendCode( message: Message, text, lang) {
	if ( message.delete )
		message.delete();

	message.channel.sendCode( lang, text );
}
