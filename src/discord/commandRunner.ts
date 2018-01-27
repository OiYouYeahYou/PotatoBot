import { Message } from "discord.js";
import { prefix, prefixHelp } from "../constants";
import { helpFunction, ICommandWrapper, getCommandWrapper } from "../commands";
import { splitCommandString } from "../util";
import { hasAuthorityForCommand, unauthorised } from "./authority";

export function runCommand( message: Message, text: string ) {
	message.channel.startTyping( 1 );

	const [ command, args, wrapper ] = aggregator( message, prefix, text );

	if ( !wrapper )
		return message.channel.stopTyping( true );

	if ( !hasAuthorityForCommand( message, wrapper ) )
		return unauthorised( message, wrapper );

	try {
		wrapper.function( message, args );
	} catch ( error ) {
		const failMessage = `Trying to run \`${ command }\` has failed`

		message.reply( failMessage );
		console.error( failMessage );
		console.error( error );
	}

	message.channel.stopTyping();
}

export function runHelp(  message: Message, text: string ) {
	message.channel.startTyping( 1 );

	const [ command, args, wrapper ] = aggregator( message, prefixHelp, text );

	if ( wrapper )
		helpFunction( message, command );

	message.channel.stopTyping( true );
}

function aggregator(
	message: Message,
	pfx: string,
	text: string
): [ string, string, false | ICommandWrapper ] {
	const [ command, args ] = splitCommandString( pfx, text );

	if ( !command )
		return [ command, args, false ];

	const wrapper = getCommandWrapper( command );

	if ( !wrapper )
		message.reply( `Cannot find \`${ command }\`` );

	return [ command, args, wrapper ]
}
