import { Message } from 'discord.js';
import { richEmbed } from '../discord/embed';
import { list } from '../commands';

list.addCommand( 'avatar', {
	func: async ( message: Message ) =>
		await message.reply( message.author.avatarURL ),
	help: 'Returns the users avatar',
} );
