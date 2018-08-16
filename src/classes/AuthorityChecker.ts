import AbstractListItem from './AbstractListItem'
import Request from './Request'

type AuthenticatorFunc = (req: Request) => boolean

export interface IAutheticatorThings {
	readonly authenticator: AuthenticatorFunc
	readonly level: string
}

interface IAuthenticatorStore {
	[key: string]: AuthenticatorFunc
}

const defaultAuthenticators: IAutheticatorThings[] = [
	{
		authenticator: req => req.member && req.member.id === req.guild.ownerID,
		level: 'owner',
	},
	{
		authenticator: req =>
			req.member && req.member.hasPermission('ADMINISTRATOR'),
		level: 'admin',
	},
]

export class AuthorityChecker {
	private readonly authenticators: Readonly<IAuthenticatorStore>

	constructor(things: IAutheticatorThings[] = defaultAuthenticators) {
		const autenticators: IAuthenticatorStore = {}

		for (const { authenticator, level } of things) {
			autenticators[level] = authenticator
		}

		this.authenticators = Object.freeze(autenticators)
		Object.freeze(this)
	}

	autheticate(req: Request, wrapper: AbstractListItem) {
		const { permission } = wrapper

		if (this.isAll(permission) || this.isMaster(req)) {
			return true
		}

		for (const perm of permission) {
			if (this.test(req, perm)) {
				return true
			}
		}

		return false
	}

	private test(req: Request, permission: string) {
		return this.authenticators[permission](req)
	}

	private isMaster(req: Request) {
		return req.author.id === process.env.master
	}

	private isAll(permission: string | string[]) {
		return permission === 'all'
	}
}
