import { Message } from 'discord.js'
import Command from './Command'

export default class CommandRunner
{
	constructor( command: Command )
	{
		this.command = command

		let runner, type

		if ( command.func && command.subCommands )
		{
			runner = this.func
			type = 'subcommand'
		}
		else if ( command.func )
		{
			runner = this.func
			type = 'command'
		}
		else if ( command.subCommands )
		{
			runner = this.sub
			type = 'submodule'
		}
		else
		{
			throw new Error( 'Stubs are not supported' )
		}

		this.runner = runner
		this.type = type
	}

	private command: Command
	/** Runs code depending on on .func and .subCommands of parent Command */
	public readonly runner: (
		message: Message,
		command: string,
		args: string
	) => Promise<any>
	/** The runner type the class will use */
	readonly type: 'command' | 'submodule' | 'subcommand'

	/** Safely execute main function */
	private async func( message: Message, command: string, args: string )
	{
		try
		{
			await this.command.func( message, args )
		}
		catch ( error )
		{
			const failMessage = `Trying to run \`${ command }\` has failed`

			console.error( failMessage )
			console.error( error )
			await message.reply( failMessage )
		}
	}

	/** Used for Command with sub commands and no main function */
	private async sub( message: Message, command: string, args: string )
	{
		return this.command.subCommands.commandRunner( message, args )
	}
}
