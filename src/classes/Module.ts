import List from './List'
import { Message } from 'discord.js'
import AListItem, { ListItemInfo } from './AListItem'
import { CommandInfo } from './Command'

interface ModuleInfo extends ListItemInfo { }

export default class Module extends AListItem
{
	constructor( key: string, input: ModuleInfo )
	{
		super( key, input, runner )

		this.subCommands = new List
	}

	public readonly subCommands: List

	addCommand( key: string, input: CommandInfo )
	{
		if ( !this.subCommands )
			throw ReferenceError( 'This command has no sub command list' )

		return this.subCommands.addCommand( key, input )
	}

	addModule( key: string, input: ModuleInfo )
	{
		if ( !this.subCommands )
			throw ReferenceError( 'This command has no sub command list' )

		return this.subCommands.addModule( key, input )
	}
}
/** Used for Command with sub commands and no main function */
async function runner( this: Module, msg: Message, cmd: string, args: string )
{
	return this.subCommands.commandRunner( msg, args )
}
