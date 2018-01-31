import { Message } from "discord.js";
import { splitByFirstSpace } from './util';
import { List, FRegister } from './commandList';

import { WrapperCode, WrapperJS, WrapperRuby } from './commands/code';
import { WrapperDemand } from './commands/demand';
import { WrapperHelp, WrapperList } from './commands/help';
import { WrapperNever } from "./commands/neverActive";
import { WrapperRude } from './commands/humour';
import { WrapperPing, WrapperKill, WrapperInvite, WrapperRestart } from './commands/botAdministration';
import { WrapperAvatar } from './commands/generic';
import { WrapperConfig } from './commands/config';

export const list = new List

list.Command( 'help', WrapperHelp );
list.Command( 'ping', WrapperPing );
list.Command( 'avatar', WrapperAvatar );
list.Command( 'kill', WrapperKill );
list.Command( 'restart', WrapperRestart );
list.Command( 'list', WrapperList );
list.Command( 'invite', WrapperInvite );
list.Command( 'shutup', WrapperRude );
list.Command( 'never', WrapperNever );
list.Command( 'code', WrapperCode );
list.Command( 'js', WrapperJS );
list.Command( 'ruby', WrapperRuby );
list.Command( 'demand', WrapperDemand );
list.Command( 'config', WrapperConfig );

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
