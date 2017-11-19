import { Message, RichEmbed } from 'discord.js';
import { client } from '../';
import { richEmbed } from '../discord/embed';
import { TBotRes } from '../types';
import { getCommandWrapper } from './';

type TCommandFunction = ( message: Message, args: string ) => TBotRes;

export function ping( message, args ): TBotRes {
	message.reply( 'pong' );
	return;
}

export function sendhelp( message, args ): TBotRes {
	return true;
}

export function avatar( message, args ): TBotRes {
	message.reply( message.author.avatarURL )
		.then( msg => msg.channel.stopTyping( true ) )
		.catch();
}

export function wait( message, args ): TBotRes {
	message.channel.startTyping( 1 );
	message.client.setTimeout(
		_ => {
			message.reply( 'I have waited' );
			message.channel.stopTyping( true );
		},
		2000
	);
}

export function fancy( message, args ): TBotRes {
	message.channel.send( { embed: richEmbed() } );
	return;
}

export function help(
	message: Message, command: string, result?: string
): TBotRes {
	var commandWrapper = getCommandWrapper( command ),
		embed = richEmbed();

	if ( !commandWrapper ) {
		// TODO: Not a recognised command
		embed
			.setTitle( `Help : ${ command } is not recognised` )
			.setDescription( 'Try using ;list to find your command' );
	}
	else {
		embed
			.setTitle( `Help : ${ command }` )
			.addField( 'Usage', commandWrapper.usage || '*blank*' )
			.addField( 'Purpose', commandWrapper.help || '*blank*' );
	}

	if ( typeof result === 'string' )
		embed.addField( 'What went wrong', result );

	message.channel.send( { embed } );
	return;
}

export function destroy( message, args ): TBotRes {
	console.log( 'destroying' );

	client.destroy()
	.then( () => {
		console.log( 'destroyed' );
	} ).catch( () => {
		console.log( 'failing to destroy' );
	} );
}

export function tantrum(): TBotRes {
	throw 'BooHoo : tantrum was called';
}
