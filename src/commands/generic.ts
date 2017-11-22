import { Message } from 'discord.js';
import { commands } from '../commands';
import { richEmbed } from '../discord/embed';
import { client } from '../index';

export const WrapperTantrum = {
	func: () => { throw 'BooHoo : tantrum was called'; },
};

export const WrapperPing = {
	func: ( message ) => { message.reply( 'pong' ); },
};

export const WrapperAvatar = {
	func: ( message ) => {
		message.reply( message.author.avatarURL )
			.then( () => message.channel.stopTyping( true ) )
			.catch();
	},
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
};

export const WrapperKill = {
	func: ( message ) => {
		console.log( 'destroying' );

		client.destroy().then( () => {
			console.log( 'destroyed' );
		} ).catch( () => {
			console.log( 'failing to destroy' );
		} );
	},
	help: 'destroys the client',
};

export const WrapperList = {
	func: ( message: Message ) => {
		var commandList = Object.keys( commands ).sort().join( '\n' );
		message.channel.send( commandList );
		message.channel.stopTyping( true );
	},
};

export const WrapperFancy = {
	func: ( message ) => { message.channel.send( { embed: richEmbed() } ); },
};

export const WrapperInvite = {
	func: ( message ) => {
		client.generateInvite().then(
			link => message.channel.send( link )
		);
	},
};
