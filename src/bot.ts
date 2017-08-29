// tslint:disable
//@ts-check
/* jshint node : true, esversion : 6, laxbreak : true */

require( './env' );
import Discord = require( 'discord.js' );
import botCommands = require( './botCommands' );
// const kindred = require( './kindred' );
import keys = require( './keys' );
import u = require( './util' );

var prefix = ';',
	prefixHelp = '?';

botCommands.verifyBotCommands();

//  //  //  //  //  Client

const clientOptions = { fetchAllMembers: true };
export const client: Discord.Client = new Discord.Client( clientOptions );

client.on( 'ready', ready );
client.on( 'message', messageRecived ); // Diff function to event
client.on( 'guildMemberAdd', guildMemberAdd );
client.on( 'guildMemberRemove', guildMemberRemove );

client.login( process.env.discord );

//  //  //  //  //  Event Functions

function ready() { console.log( 'I am ready!' ); }

function messageRecived( message: Discord.Message ) { // Diff function to event
	var content, indexOfFirstSpace, hasSpace, startOfArgs, command, args, func, result;

	content = message.content.trim();

	// if content is not prefixed or prefix is invalid
	if ( !u.validatePrefix( prefix, content ) ) return;

	message.channel.startTyping( 1 );

	indexOfFirstSpace = u.indexOf( content, ' ' );
	hasSpace = indexOfFirstSpace > 0;
	startOfArgs = hasSpace ? indexOfFirstSpace : undefined;
	command = content.slice( prefix.length, startOfArgs ).trim().toLowerCase();

	if ( u.validatePrefix( prefixHelp, command ) ) {
		command = command.slice( prefixHelp.length ).trim();
		result = true;
	}
	else {
		args = hasSpace ? content.slice( indexOfFirstSpace ).trim() : undefined;
		func = botCommands.getFunc( command );
	}

	if ( func )
		try { result = func( message, args ); }
		catch ( e ) {
			console.error( e );
			message.reply( `An error occurred, please contact a developer. But not the dev who made this` );
			result = true;
		}
	else if ( func === false )
		result = true;

	if ( result ) botCommands.help( message, command, result );

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

