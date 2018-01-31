import { Message } from "discord.js";
import { list } from "../commands";

list.Command( 'shutup', {
	func: async ( message: Message ) =>
		message.reply( 'Bitch Noooo!!!!' ),
	help: 'Provides a bot inviter link',
} );
