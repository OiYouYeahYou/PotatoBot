import { Message } from 'discord.js';
import { commands, IApplicationWrapper } from '../commands';
import { richEmbed } from '../discord/embed';

export const WrapperAvatar = {
	func: ( message ) => {
		message.reply( message.author.avatarURL )
			.then( () => message.channel.stopTyping( true ) )
			.catch();
	},
	help: 'Returns the users avatar',
};
