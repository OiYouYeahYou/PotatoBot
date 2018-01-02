// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Message } from 'discord.js';
import { getCommandWrapper, helpFunction, ICommandWrapper, } from '../commands';
import { prefix, prefixHelp } from '../constants';
import { isPrefixed, splitCommandString } from '../util';

export function ready() {
	console.log( 'I am ready!' );
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

function runCommand( message: Message, text: string ) {
	message.channel.startTyping( 1 );

	var [ command, args ] = splitCommandString( prefix, text );

	var wrapper = getCommandWrapper( command );

	if ( !wrapper )
		return noCommandFound( message, command );

	if ( !hasAuthorityForCommand( message, wrapper ) )
		return unauthorised( message, wrapper );

	try {
		wrapper.function( message, args );
	} catch ( error ) {
		message.reply( `Trying to run \`${ command }\` has failed` );
	}

	message.channel.stopTyping();
}

function runHelp(  message: Message, text: string ) {
	message.channel.startTyping( 1 );

	var [ command ] = splitCommandString( prefixHelp, text );

	var wrapper = getCommandWrapper( command );

	if ( !wrapper )
		return noCommandFound( message, command );

	helpFunction( message, command );

	message.channel.stopTyping();
}

function noCommandFound( message: Message, command: string ) {
	message.reply( `Cannot find \`${ command }\`` );
}

function everyoneResponse( message: Message ) {
	if ( message.deletable )
		message.delete();

	message.reply( "Don't mention everyone!!", {
		// file: "https://cdn.weeb.sh/images/ryKLMPEj-.png"
	} );
}

function hasAuthorityForCommand( message: Message, wrapper: ICommandWrapper ) {
	var { permisson } = wrapper;

	if ( permisson === 'all' )
		return true;
	else if ( permisson === 'master' )
		return isMaster( message );
	else if ( permisson === 'owner' )
		return isOwner( message ) || isMaster( message );
	else if ( permisson === 'admin' )
		return isAdmin( message );

	return false;
}

function isOwner( message: Message ) {
	return message.member.id === message.guild.ownerID;
}

function isMaster( message: Message ) {
	return message.member.id === process.env.master;
}

function isAdmin( message: Message ) {
	return message.member.hasPermission( 'ADMINISTRATOR' );
}

function unauthorised( message: Message, wrapper: ICommandWrapper ) {
	message.reply(
		`You are not autorised to use that command, you must be a ${ wrapper.permisson }`
	);
}