import { Message } from 'discord.js'
import { prefix } from '../constants'
import AListItem, { ListItemInfo } from './AListItem'

export interface CommandInfo extends ListItemInfo
{
	func: FCommand
}

export type FCommand = ( message: Message, args: string ) => Promise<any>

/** Command data handler */
export default class Command extends AListItem
{
	/** Wraps the information about a command */
	constructor( key: string, input: CommandInfo )
	{
		super( key, input, runner )
		this.func = input.func
	}

	public readonly func: FCommand
}

async function runner(
	this: Command, message: Message, command: string, args: string
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
