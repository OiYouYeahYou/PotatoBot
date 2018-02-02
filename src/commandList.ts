import { Message } from 'discord.js';
import { prefix } from './constants';
import ListRunner from './classes/ListRunner';
import CommandRunner from './classes/CommandRunner';

export interface IApplicationWrapper {
	func?: FCommand
	help: string
	usage?: string
	disabled?: boolean
	aliases?: string[]
	permission?: TPermission
	subCommands?: List
}

type TPermission = 'all' | 'master' | 'owner' | 'admin'
export type FCommand = ( message: Message, args: string ) => Promise<any>
export type FRegister = ( key: string, instance: Command ) => void
export interface ICommand extends Command { }

export class List {
	constructor() {
		this.runner = new ListRunner( this )
	}

	/** Contains Command instances */
	readonly list: { [ key: string ]: Command } = {}
	/** Class instance that conatains the logic for handling message events */
	readonly runner: ListRunner

	/** Creates a new class that is registered with list */
	addCommand( key: string, input: IApplicationWrapper ) {
		if ( input.disabled )
			return

		key = key.toLowerCase()

		const instance = new Command( key, input )

		this.register( key, instance )

		if ( input.aliases )
			for ( const alias of input.aliases )
				this.register( alias, instance )

		return instance
	}

	/** Registers new commands in list */
	private register( key: string, instance: Command ) {
		key = key.trim().toLowerCase()

		this.keyValidator( key )

		this.list[ key ] = instance
	}

	/** Validates new keys to prevent invalid chars and overwrites */
	private keyValidator( key: string ) {
		if ( key.indexOf( ' ' ) !== -1 )
			throw new Error( `Key contains space \'${ key }\'` )

		if ( key in this.list )
			throw new Error( `Key already exists in commands \'${ key }\'` )

		if ( key !== key.toLowerCase() )
			throw new Error( `Keys must be lowercase \'${ key }\'` )
	}

	/** Returns a command based on the key */
	getCommandWrapper( cmd: string ): Command | false {
		if ( cmd in this.list )
			return this.list[ cmd ]

		return false
	}
}

/** Command data handler */
class Command {
	/** Wraps the information about a command */
	constructor( key: string, input: IApplicationWrapper ) {
		const { func, help, permission, usage, aliases, subCommands } = input

		this.key = key
		this.func = func
		this.help = help
		this.permission = permission ? permission : 'all'
		this.usage = `${ prefix }${ key } ${ usage || '' }`.trim()

		if ( aliases && aliases.length )
			this.aliases = `${ key }, ${ aliases.join( ', ' ) }`

		if ( subCommands )
			this.subCommands = subCommands

		this.runner = new CommandRunner( this )
	}

	public readonly func: FCommand
	public readonly permission: TPermission
	public readonly subCommands: List

	public readonly key: string
	public readonly help: string
	public readonly usage: string
	public readonly aliases: string

	readonly runner: CommandRunner
}
