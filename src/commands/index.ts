import { Message, RichEmbed } from 'discord.js';
import { bind } from '../bind';
import { TBotRes } from '../types';
import * as generic from './generic';

export type TCommandFunction = ( message: Message, args: string ) => TBotRes;

export interface ICommandWrapper {
	function: TCommandFunction;
	help?: string;
	usage?: string;
	disabled?: boolean;
}

export interface ICommandWrapperWrapper {
	[keys: string]: ICommandWrapper;
}

export const commands: ICommandWrapperWrapper = {
	help: {
		function: ( message, args ) => generic.help( message, args ),
		help: 'this is not helpful',
		usage: ';bind <region> <username>',
	},
	sendhelp: {
		function: generic.sendhelp,
		help: 'there is no help',
	},
	tantrum: {
		function: generic.tantrum,
		help: 'this is not helpful',
		usage: '',
	},
	ping: {
		function: generic.ping,
		help: 'this is not helpful',
		usage: '',
	},
	avatar: {
		function: generic.avatar,
		help: 'this is not helpful',
		usage: '',
	},
	wait: {
		function: generic.wait,
		help: 'this is not helpful',
		usage: '',
	},
	bind: {
		function: bind,
		help: 'this is not helpful',
		usage: '',
		disabled: true,
	},
	kill: {
		function: generic.destroy,
		help: 'destroys the client',
		usage: '',
	},
};

export const help = generic.help;

export function getCommandWrapper( cmd: string ): ICommandWrapper | false {
	console.log( 'new' );
	if ( cmd in commands && !commands[ cmd ].disabled )
		return commands[ cmd ];
	else
		return false;
}
