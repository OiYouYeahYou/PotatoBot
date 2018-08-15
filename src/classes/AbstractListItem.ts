import Request from './Request'

export interface IListItemInfo {
	help: string
	usage?: string
	disabled?: boolean
	aliases?: string[]
	permission?: TPermission
}

type TPermission = 'all' | 'master' | 'owner' | 'admin' | 'custom'

/** Command data handler */
export default abstract class AbstractListItem {
	readonly permission: TPermission

	readonly help: string
	readonly usage: string
	readonly aliases: string

	/** Wraps the information about a command */
	constructor(readonly key: string, input: Readonly<IListItemInfo>) {
		const { help, permission, usage, aliases } = input

		this.key = key
		this.help = help
		this.permission = permission ? permission : 'all'
		this.usage = `${key} ${usage || ''}`.trim()

		if (aliases && aliases.length)
			this.aliases = `${key}, ${aliases.join(', ')}`
	}

	abstract async runner(req: Request, cmd: string, args: string): Promise<any>
}
