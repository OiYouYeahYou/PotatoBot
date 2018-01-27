// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Message } from 'discord.js';
import { prefix, prefixHelp } from '../constants';
import { isPrefixed } from '../util';
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

export function messageRecived( message: Message ) {
	var text = message.content.trim();

	if ( message.author.bot )
		return;

	if ( isPrefixed( prefixHelp, text ) )
		runHelp( message, text );
	else if ( isPrefixed( prefix, text ) )
		runCommand( message, text );
	else if ( message.mentions.everyone )
		everyoneResponse( message );
}

export function guildMemberAdd( member ) {
	member.guild.defaultChannel.send( `Welcome to the server, ${ member }!` );
}

export function guildMemberRemove( member ) {
	member.guild.defaultChannel.send( `${ member } has left!` );
}

