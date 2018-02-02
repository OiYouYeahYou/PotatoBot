import { Message } from 'discord.js';
import { list } from '../commands';

export async function never( message: Message, args: string ) {
	var { guild } = message;
	var { members } = guild;

	var inactive = members.filterArray(
		member => member.lastMessage ? false : true
	);

	return message.reply( inactive.length );
}

list.addCommand( 'never', {
	func: never,
	help: 'Displays the number of people who have not sent a message',
} );
