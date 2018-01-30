// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Message } from 'discord.js';
import { prefix, prefixHelp } from '../constants';
import { isPrefixed, somethingWentWrong } from '../util';
import { runHelp, runCommand } from './commandRunner';
import { everyoneResponse } from './features';

export const ready = () =>
	console.log( 'Discord client is ready!' );

export const disconnect = () =>
	console.log( 'Discord client has disconnected' );

export const reconnecting = () =>
	console.log( 'Discord client is reconnecting' );

export function error( err ) {
	console.error( 'A Discord error occured' );
	console.error( err );
}

export async function messageRecived( message: Message ) {
	var text = message.content.trim();

	if ( message.author.bot )
		return;

	try {
		if ( isPrefixed( prefixHelp, text ) )
			await runHelp( message, text );
		else if ( isPrefixed( prefix, text ) )
			await runCommand( message, text );
		else if ( message.mentions.everyone )
			await everyoneResponse( message );
	} catch ( error ) {
		await somethingWentWrong( message, error );
	}
}

export function guildMemberAdd( member ) {
	member.guild.defaultChannel.send( `Welcome to the server, ${ member }!` );
}

export function guildMemberRemove( member ) {
	member.guild.defaultChannel.send( `${ member } has left!` );
}

