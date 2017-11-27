// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Client, Message } from 'discord.js';
import { getCommandWrapper, helpFunction, } from './commands';
import { isPrefixed, quatch, setEnv, splitCommandString } from './util';

setEnv();

var prefix = ';',
	prefixHelp = prefix + '?';

//  //  //  //  //  Client

const clientOptions = { fetchAllMembers: true };
export const client = new Client( clientOptions );

client.on( 'ready', ready );
client.on( 'message',
	message => quatch( () => messageRecived( message ) )
);
client.on( 'guildMemberAdd', guildMemberAdd );
client.on( 'guildMemberRemove', guildMemberRemove );

client.login( process.env.discord );

//  //  //  //  //  Event Functions

function ready() {
	console.log( 'I am ready!' );
}

function messageRecived( message: Message ) {
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

function guildMemberAdd( member ) {
	member.guild.defaultChannel.send( `Welcome to the server, ${ member }!` );
}

function guildMemberRemove( member ) {
	member.guild.defaultChannel.send( `${ member } has left!` );
}

function runCommand( message: Message, text: string ) {
	message.channel.startTyping( 1 );

	var [ command, args ] = splitCommandString( prefix, text );

	var wrapper = getCommandWrapper( command );

	if ( !wrapper )
		return noCommandFound( message, command );

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
