import AbstractListItem, { IListItemInfo } from './AbstractListItem'
import Request from './Request'

export interface ICommandInfo extends IListItemInfo {
	func: FCommand
}

export type FCommand = (req: Request, args: string) => Promise<any>

/** Command data handler */
export default class Command extends AbstractListItem {
	private readonly func: FCommand

	/** Wraps the information about a command */
	constructor(key: string, input: ICommandInfo) {
		super(key, input)
		this.func = input.func
	}

	async runner(req: Request, command: string, args: string) {
		try {
			await this.func(req, args)
		} catch (error) {
			const failMessage = `Trying to run \`${command}\` has failed`

			console.error(failMessage)
			console.error(error)
			await req.reply(failMessage)
		}
	}
}
