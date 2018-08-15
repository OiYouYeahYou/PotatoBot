import AbstractListItem, { IListItemInfo } from './AbstractListItem'
import { ICommandInfo } from './Command'
import List from './List'
import Request from './Request'

export default class Module extends AbstractListItem {
	readonly subCommands = new List()
	constructor(key: string, input: IListItemInfo) {
		super(key, input)
	}

	addCommand(key: string, input: ICommandInfo) {
		return this.subCommands.addCommand(key, input)
	}

	addModule(key: string, input: IListItemInfo) {
		return this.subCommands.addModule(key, input)
	}

	/** Used for Command with sub commands and no main function */
	runner(this: Module, req: Request, cmd: string, args: string) {
		return this.subCommands.commandRunner(req, args)
	}
}
