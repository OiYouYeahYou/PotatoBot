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
	}

	public readonly subCommands = new List

	addCommand( key: string, input: CommandInfo )
	{
		return this.subCommands.addCommand( key, input )
	}

	addModule( key: string, input: ModuleInfo )
	{
		return this.subCommands.addModule( key, input )
	}
}
/** Used for Command with sub commands and no main function */
async function runner( this: Module, msg: Message, cmd: string, args: string )
{
	return this.subCommands.commandRunner( msg, args )
}
