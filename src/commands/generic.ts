import { Message } from 'discord.js';
import { commands, IApplicationWrapper } from '../commands';
import { richEmbed } from '../discord/embed';

export const WrapperTantrum = {
	func: () => { throw 'BooHoo : tantrum was called'; },
	help: 'Intentionally throws an exception to test code integrity',
};

export const WrapperPing = {
	func: ( message ) => { message.reply( 'pong' ); },
	help: 'Tests latency of the server',
	aliases: [ 'pong' ],
};

export const WrapperAvatar = {
	func: ( message ) => {
		message.reply( message.author.avatarURL )
			.then( () => message.channel.stopTyping( true ) )
			.catch();
	},
	help: 'Returns the users avatar',
};

export const WrapperWait = {
	func: ( message ) => {
		message.channel.startTyping( 1 );
		message.client.setTimeout(
			_ => {
				message.reply( 'I have waited' );
				message.channel.stopTyping( true );
			},
			2000
		);
	},
	help: 'Wait 5 seconds and responds',
};

export const WrapperKill: IApplicationWrapper = {
	func: ( message ) => {
		console.log( 'destroying' );
		message.reply( 'MURRDERRRR!!!' ).then( () => {
			message.client.destroy()
				.then( () => { console.log( 'destroyed' ); } )
				.catch( () => { console.log( 'failing to destroy' ); } );
		} );
	},
	help: 'Destroys the message.',
	aliases: [ 'kys', ],
	permisson: 'master',
};

export const WrapperList = {
	func: ( message: Message ) => {
		var commandList = Object.keys( commands ).sort().join( '\n' );
		message.channel.send( commandList );
		message.channel.stopTyping( true );
	},
	help: 'Provides a list of commands',
};

export const WrapperFancy = {
	func: ( message ) => { message.channel.send( { embed: richEmbed() } ); },
	help: 'Sends a generic embed',
};

export const WrapperInvite = {
	func: ( message ) => {
		message.client.generateInvite().then(
			link => message.channel.send( link )
		);
	},
	help: 'Provides a bot inviter link',
};

export const WrapperRude = {
	func: ( message ) => {
		message.reply( 'Bitch Noooo!!!!' );
	},
	help: 'Provides a bot inviter link',
};
