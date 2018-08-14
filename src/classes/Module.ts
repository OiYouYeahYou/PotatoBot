import List from './List'
import Request from './Request';
import AbstractListItem, { ListItemInfo } from './AbstractListItem'
import { CommandInfo } from './Command'

interface ModuleInfo extends ListItemInfo { }

export default class Module extends AbstractListItem
{
	constructor( key: string, input: ModuleInfo )
	{
		super( key, input )
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

	/** Used for Command with sub commands and no main function */
	runner( this: Module, req: Request, cmd: string, args: string )
	{
		return this.subCommands.commandRunner( req, args )
	}
}
