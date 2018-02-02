import CommandRunner from "./CommandRunner";
import { Message } from "discord.js";
import List from "../classes/List";
import { prefix } from "../constants";

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

/** Command data handler */
export default class Command {
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
