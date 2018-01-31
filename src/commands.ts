export { helpFunction } from './commands/help';
import { Message } from "discord.js";
import { WrapperCode, WrapperJS, WrapperRuby } from './commands/code';
import { WrapperDemand } from './commands/demand';
import * as generic from "./commands/generic";
import { WrapperHelp, WrapperList } from './commands/help';
import { WrapperNever } from "./commands/neverActive";
import { WrapperRude } from './commands/humour';
import { WrapperPing, WrapperKill, WrapperInvite, WrapperRestart } from './commands/botAdministration';
import { WrapperAvatar } from './commands/generic';
import { WrapperConfig } from './commands/config';
import { splitByFirstSpace } from './util';

export const commands: ICommands = {};

registerWrapper( 'help', WrapperHelp );
registerWrapper( 'ping', WrapperPing );
registerWrapper( 'avatar', WrapperAvatar );
registerWrapper( 'kill', WrapperKill );
registerWrapper( 'restart', WrapperRestart );
registerWrapper( 'list', WrapperList );
registerWrapper( 'invite', WrapperInvite );
registerWrapper( 'shutup', WrapperRude );
registerWrapper( 'never', WrapperNever );
registerWrapper( 'code', WrapperCode );
registerWrapper( 'js', WrapperJS );
registerWrapper( 'ruby', WrapperRuby );
registerWrapper( 'demand', WrapperDemand );
registerWrapper( 'config', WrapperConfig );

export function getCommandWrapper( cmd: string ): ICommandWrapper | false {
	if ( cmd in commands )
		return commands[ cmd ];

	return false;
}

export function registerWrapper( key: string, input: IApplicationWrapper ): void {
	if ( input.disabled )
		return;

	key = key.toLowerCase();

	var { func, help } = input;
	var output: ICommandWrapper = {
		function: func, help, key, permission: 'all'
	};

	if ( input.permission )
		output.permission = input.permission;

	output.usage = `;${ key } ${ input.usage || '' }`.trim();

	if ( input.aliases ) {
		output.aliases = `${ key }`;

		input.aliases.forEach( alias => {
			alias = alias.toLowerCase().trim();
			output.aliases += `, ${ alias }`;
			setCommmand( alias, output );
		} );
	}

	setCommmand( key, output );
}

function setCommmand( key: string, wrapper: ICommandWrapper ) {
	if ( key in commands )
		throw new Error( `Key already exists in commands \'${ key }\'` );
	if ( key.indexOf( ' ' ) !== -1 )
		throw new Error( `Key contains space \'${ key }\'` );

	commands[ key ] = wrapper;
}

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

export interface IApplicationWrapper {
	func: TCommandFunction;
	help: string;
	usage?: string;
	disabled?: boolean;
	aliases?: string[];
	permission?: TPermission;
}

export interface ICommandWrapper {
	function: TCommandFunction;
	key: string;
	help?: string;
	usage?: string;
	aliases?: string;
	permission: TPermission;
}

interface ICommands {
	[ keys: string ]: ICommandWrapper;
}

export interface ISubCommands {
	[ keys: string ]: TCommandFunction;
}

type TPermission = 'all' | 'master' | 'owner' | 'admin';
