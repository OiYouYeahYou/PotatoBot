import Command, { IApplicationWrapper } from "./Command";
import List from "./List";
import { Message } from "discord.js";

export default class Module extends Command
{
	constructor( key: string, input: IApplicationWrapper )
	{
		const { subCommands, func } = input

		if ( func )
			throw new Error( 'Module class does not support func property' )

		super( key, input )

		if ( subCommands )
			this.subCommands = new List

		this.runner = this._ModuleRunner
	}

	public readonly subCommands: List

	/** Used for Command with sub commands and no main function */
	private async _ModuleRunner( message: Message, command: string, args: string )
	{
		return this.subCommands.commandRunner( message, args )
	}

	addSubCommand( key: string, input: IApplicationWrapper )
	{
		if ( !this.subCommands )
			throw ReferenceError( 'This command has no sub command list' )

		return this.subCommands.addCommand( key, input )
	}
}
