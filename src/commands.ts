export { helpFunction } from './commands/help';
import { Message } from "discord.js";
import { WrapperCode, WrapperJS, WrapperRuby } from './commands/code';
import { WrapperDemand } from './commands/demand';
import * as generic from "./commands/generic";
import { WrapperHelp, WrapperList } from './commands/help';
import { WrapperNever } from "./commands/neverActive";
import { WrapperRude } from './commands/humour';
import { WrapperPing, WrapperKill, WrapperInvite } from './commands/botAdministration';
import { WrapperAvatar } from './commands/generic';

export const commands: ICommands = {};

registerWrapper( 'help', WrapperHelp );
registerWrapper( 'ping', WrapperPing );
registerWrapper( 'avatar', WrapperAvatar );
registerWrapper( 'kill', WrapperKill );
registerWrapper( 'list', WrapperList );
registerWrapper( 'invite', WrapperInvite );
registerWrapper( 'shutup', WrapperRude );
registerWrapper( 'never', WrapperNever );
registerWrapper( 'code', WrapperCode );
registerWrapper( 'js', WrapperJS );
registerWrapper( 'ruby', WrapperRuby );
registerWrapper( 'demand', WrapperDemand );

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
		function: func, help, key, permisson: 'all'
	};

	if ( input.permisson )
		output.permisson = input.permisson;

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

type TCommandFunction = ( message: Message, args: string ) => void;

export interface IApplicationWrapper {
	func: TCommandFunction;
	help: string;
	usage?: string;
	disabled?: boolean;
	aliases?: string[];
	permisson?: TPermisson;
}

export interface ICommandWrapper {
	function: TCommandFunction;
	key: string;
	help?: string;
	usage?: string;
	aliases?: string;
	permisson: TPermisson;
}

interface ICommands {
	[ keys: string ]: ICommandWrapper;
}

type TPermisson = 'all' | 'master' | 'owner' | 'admin';
