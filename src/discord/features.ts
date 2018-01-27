import { Message } from "discord.js";

export function everyoneResponse( message: Message ) {
	if ( message.deletable )
		message.delete();

	message.reply( "Don't mention everyone!!", {
		// file: "https://cdn.weeb.sh/images/ryKLMPEj-.png"
	} );
}
