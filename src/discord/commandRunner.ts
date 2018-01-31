import { Message } from "discord.js";
import { prefix, prefixHelp } from "../constants";
import { list } from "../commands";
import { splitCommandString } from "../util";
import { hasAuthorityForCommand, unauthorised } from "./authority";
import { ICommand } from "../commandList";
import { helpFunction } from "../commands/help";

export async function runCommand( message: Message, text: string ) {
	message.channel.startTyping( 1 );

	const [ command, args, wrapper ] = await aggregator( message, prefix, text );

	if ( !wrapper )
		return message.channel.stopTyping( true );

	if ( !hasAuthorityForCommand( message, wrapper ) )
		await unauthorised( message, wrapper );
	else
		try {
			await wrapper.func( message, args );
		} catch ( error ) {
			const failMessage = `Trying to run \`${ command }\` has failed`

			await message.reply( failMessage );
			console.error( failMessage );
			console.error( error );
		}

	message.channel.stopTyping( true );
}

export async function runHelp(  message: Message, text: string ) {
	message.channel.startTyping( 1 );

	const [ command, args, wrapper ] = await aggregator( message, prefixHelp, text );

	if ( wrapper )
		await helpFunction( message, command );

	message.channel.stopTyping( true );
}

async function aggregator(
	message: Message,
	pfx: string,
	text: string
): Promise<[ string, string, false | ICommand ]> {
	const [ command, args ] = splitCommandString( pfx, text );

	if ( !command )
		return [ command, args, false ];

	const wrapper = list.getCommandWrapper( command );

	if ( !wrapper )
		await message.reply( `Cannot find \`${ command }\`` );

	return [ command, args, wrapper ];
}