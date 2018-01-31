import { Message } from "discord.js";
import { splitByFirstSpace, requireInFile } from './util';
import { List } from './commandList';

export const list = new List
requireInFile( 'commands' );

export async function subCommandHandler(
	message: Message,
	subModules: ISubCommands,
	args: string,
	noMain: boolean = true
) {
	const [ subCommand, subArguments ] = splitByFirstSpace( args );
	let error, result;
	const subCommandFunction =
		subCommand && subModules[ subCommand.toLowerCase() ];

	if ( subCommandFunction )
		try {
			result = await subCommandFunction( message, subArguments );
		} catch ( err ) {
			error = err;
		}
	else if ( noMain )
		await message.reply( `Not a recocnised subcommand: ${ subCommand }` );

	return [
		subCommand,
		subArguments,
		subCommandFunction,
		result,
		error
	];
}

type TCommandFunction = ( message: Message, args: string ) => Promise<any>;
export interface ISubCommands {
	[ keys: string ]: TCommandFunction;
}
