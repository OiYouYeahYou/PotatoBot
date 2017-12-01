import { Message } from 'discord.js';

export function never( message: Message, args: string ) {
	var { guild } = message;
	var { members } = guild;

	var inactive = members.filterArray(
		member => member.lastMessage ? false : true
	);

	message.reply( inactive.length );
}

export const WrapperNever = {
	func: never,
	help: 'Displays the number of people who have not sent a message',
};