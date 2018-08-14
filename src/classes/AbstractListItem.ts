import Request from './Request'

export interface ListItemInfo
{
	help: string
	usage?: string
	disabled?: boolean
	aliases?: string[]
	permission?: TPermission
}

type TPermission = 'all' | 'master' | 'owner' | 'admin' | 'custom'

/** Command data handler */
export default abstract class AbstractListItem
{
	public readonly permission: TPermission

	public readonly help: string
	public readonly usage: string
	public readonly aliases: string

	/** Wraps the information about a command */
	constructor( readonly key: string, input: Readonly<ListItemInfo> )
	{
		const { help, permission, usage, aliases } = input

		this.key = key
		this.help = help
		this.permission = permission ? permission : 'all'
		this.usage = `${ key } ${ usage || '' }`.trim()

		if ( aliases && aliases.length )
			this.aliases = `${ key }, ${ aliases.join( ', ' ) }`
	}

	abstract async runner(
		req: Request,
		cmd: string,
		args: string
	): Promise<any>
}
