import { Message } from 'discord.js'
import { prefix } from '../constants'

export interface IApplicationWrapper
{
	func?: FCommand
	help: string
	usage?: string
	disabled?: boolean
	aliases?: string[]
	permission?: TPermission
	subCommands?: boolean
}

type TPermission = 'all' | 'master' | 'owner' | 'admin'
export type FCommand = ( message: Message, args: string ) => Promise<any>

/** Command data handler */
export default class Command
{
	/** Wraps the information about a command */
	constructor( key: string, input: IApplicationWrapper )
	{
		const { func, help, permission, usage, aliases, subCommands } = input

		this.key = key
		this.func = func
		this.help = help
		this.permission = permission ? permission : 'all'
		this.usage = `${ prefix }${ key } ${ usage || '' }`.trim()

		if ( aliases && aliases.length )
			this.aliases = `${ key }, ${ aliases.join( ', ' ) }`
	}

	public readonly func: FCommand
	public readonly permission: TPermission

	public readonly key: string
	public readonly help: string
	public readonly usage: string
	public readonly aliases: string

	runner: ( message: Message, command: string, args: string ) => Promise<any>
		= this._CommandRunner

	private async _CommandRunner(
		message: Message, command: string, args: string
	)
	{
		try
		{
			await this.func( message, args )
		}
		catch ( error )
		{
			const failMessage = `Trying to run \`${ command }\` has failed`

			console.error( failMessage )
			console.error( error )
			await message.reply( failMessage )
		}
	}
}
