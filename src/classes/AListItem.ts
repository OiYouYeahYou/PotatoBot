import Request from './Request'

export interface ListItemInfo
{
	help: string
	usage?: string
	disabled?: boolean
	aliases?: string[]
	permission?: TPermission
}

export interface IAbstractListItem<
	injectClass extends AListItem,
	injectInterface extends ListItemInfo
	>
{
	new( key: string, input: injectInterface ): injectClass
}

type TPermission = 'all' | 'master' | 'owner' | 'admin' | 'custom'
type FRunner = ( req: Request, command: string, args: string )
	=> Promise<any>

/** Command data handler */
export default abstract class AListItem
{
	public readonly permission: TPermission

	public readonly help: string
	public readonly usage: string
	public readonly aliases: string

	/** Wraps the information about a command */
	constructor(
		readonly key: string,
		input: ListItemInfo,
		readonly runner: FRunner
	)
	{
		const { help, permission, usage, aliases } = input

		this.key = key
		this.help = help
		this.permission = permission ? permission : 'all'
		this.usage = `${ key } ${ usage || '' }`.trim()

		if ( aliases && aliases.length )
			this.aliases = `${ key }, ${ aliases.join( ', ' ) }`

		this.runner = runner
	}
}
