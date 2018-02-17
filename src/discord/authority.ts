import { Message } from 'discord.js'
import AListItem from '../classes/AListItem'

export function hasAuthorityForCommand( message: Message, wrapper: AListItem )
{
	var { permission } = wrapper

	if ( permission === 'all' )
		return true
	else if ( permission === 'master' )
		return isMaster( message )
	else if ( permission === 'owner' )
		return isOwner( message ) || isMaster( message )
	else if ( permission === 'admin' )
		return isAdmin( message )

	return false
}

function isOwner( message: Message )
{
	return message.member && message.member.id === message.guild.ownerID
}

function isMaster( message: Message )
{
	return message.author.id === process.env.master
}

function isAdmin( message: Message )
{
	return message.member && message.member.hasPermission( 'ADMINISTRATOR' )
}

export async function unauthorised( message: Message, wrap: AListItem )
{
	return message.reply(
		`You are not autorised to use that command, `
		+ `you must be a ${ wrap.permission }`
	)
}
