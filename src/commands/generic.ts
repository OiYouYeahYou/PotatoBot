import { Message } from 'discord.js';
import { commands, IApplicationWrapper } from '../commands';
import { richEmbed } from '../discord/embed';

export const WrapperAvatar = {
	func: async ( message: Message ) =>
		await message.reply( message.author.avatarURL ),
	help: 'Returns the users avatar',
};
