import { Message } from 'discord.js'
import Command from './Command'

export default class CommandRunner
{
	constructor( command: Command )
	{
		this.command = command

		let runner;

		if ( command.func )
			runner = this.func
		else if ( command.subCommands )
			runner = this.sub
		else
			runner = this.stub

		this.runner = runner
	}

	private command: Command
	/** Runs code depending on on .func and .subCommands of parent Command */
	public readonly runner: (
		message: Message,
		command: string,
		args: string
	) => Promise<any>

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
		return this.command.subCommands.runner.commandRunner( message, args )
	}

	/** Runs when neiter a main function or sub commands list exist */
	private async stub( message: Message, command: string )
	{
		return message.reply(
			`Command \`${ command }\` is a stub, soon to be available`
		)
	}
}
