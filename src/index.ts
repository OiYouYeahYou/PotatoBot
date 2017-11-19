// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Client, Message } from 'discord.js';
import { getCommandWrapper, help } from './commands/';
import { indexOf, setEnv, validatePrefix } from './util';

setEnv();

var prefix = ';',
	prefixHelp = '?';

//  //  //  //  //  Client

const clientOptions = { fetchAllMembers: true };
export const client: Client = new Client( clientOptions );

client.on( 'ready', ready );
client.on( 'message', messageRecived ); // Diff function to event
client.on( 'guildMemberAdd', guildMemberAdd );
client.on( 'guildMemberRemove', guildMemberRemove );

client.login( process.env.discord );

//  //  //  //  //  Event Functions

function ready() { console.log( 'I am ready!' ); }

function messageRecived( message: Message ) { // Diff function to event
	var content, indexOfFirstSpace, hasSpace, startOfArgs, command, args, func, result;

	content = message.content.trim();

	// if content is not prefixed or prefix is invalid
	if ( !validatePrefix( prefix, content ) ) return;

	message.channel.startTyping( 1 );

	indexOfFirstSpace = indexOf( content, ' ' );
	hasSpace = indexOfFirstSpace > 0;
	startOfArgs = hasSpace ? indexOfFirstSpace : undefined;
	command = content.slice( prefix.length, startOfArgs ).trim().toLowerCase();

	if ( validatePrefix( prefixHelp, command ) ) {
		command = command.slice( prefixHelp.length ).trim();
		result = true;
	}
	else {
		args = hasSpace ? content.slice( indexOfFirstSpace ).trim() : undefined;
		commandWrapper = getCommandWrapper( command );
	}

	if ( commandWrapper )
		try {
			result = commandWrapper.function( message, args );
		}
		catch ( e ) {
			console.error( e );
			message.reply( `An error occurred, please contact a developer. But not the dev who made this` );
			result = true;
		}
	else if ( commandWrapper === false )
		result = true;

	if ( result ) help( message, command, result );

	message.channel.stopTyping();
}

function guildMemberAdd( member ) {
	// Send the message to the guilds default channel (usually #general), mentioning the member
	member.guild.defaultChannel.send( `Welcome to the server, ${ member }!` );

	// // If you want to send the message to a designated channel on a server instead
	// // you can do the following:
	// const channel = member.guild.channels.find( 'name', 'member-log' );
	// // Do nothing if the channel wasn't found on this server
	// if ( !channel ) return;
	// // Send the message, mentioning the member
	// channel.send( `Welcome to the server, ${member}` );

}

function guildMemberRemove( member ) {
	member.guild.defaultChannel.send( `${ member } has left!` );
}

//  //  //  //  //  Private Functions
