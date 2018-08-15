import AbstractListItem from '../classes/AbstractListItem'
import Request from '../classes/Request'

export function hasAuthorityForCommand(
	req: Request,
	wrapper: AbstractListItem
) {
	const { permission } = wrapper

	if (isMaster(req)) return true

	if (permission === 'all' || permission === 'custom') return true
	else if (permission === 'owner') return isOwner(req)
	else if (permission === 'admin') return isAdmin(req)

	return false
}

function isOwner(req: Request) {
	return req.member && req.member.id === req.guild.ownerID
}

function isMaster(req: Request) {
	return req.author.id === process.env.master
}

function isAdmin(req: Request) {
	return req.member && req.member.hasPermission('ADMINISTRATOR')
}

export async function unauthorised(req: Request, wrap: AbstractListItem) {
	return req.reply(
		`You are not autorised to use that command, ` +
			`you must be a ${wrap.permission}`
	)
}
