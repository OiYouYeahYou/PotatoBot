// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install()

import { Message, GuildMember, Guild } from 'discord.js'
import { prefix } from '../constants'
import { isPrefixed, somethingWentWrong, removePrefix } from '../util'
import { everyoneResponse } from './features'
import { getDefaultChannel, isFeatureEnabled } from '../configManager'
import { announceEntry, announceExit } from './featureEnum'
import list from '../list'
import { initAutoPurge } from '../features/channelAutoPurge'

export const ready = () =>
{
	console.log( 'Discord client is ready!' )
	initAutoPurge()
}

export const disconnect = () =>
	console.log( 'Discord client has disconnected' )

export const reconnecting = () =>
	console.log( 'Discord client is reconnecting' )

export function error( err )
{
	console.error( 'A Discord error occured' )
	console.error( err )
}

export async function messageRecived( message: Message )
{
	var text = message.content.trim()

	if ( message.author.bot )
		return

	try
	{
		if ( isPrefixed( prefix, text ) )
		{
			message.channel.startTyping( 1 )
			const commandString = removePrefix( prefix, text )
			await list.commandRunner( message, commandString )
			message.channel.stopTyping( true )
		}
		else if ( message.mentions.everyone )
			await everyoneResponse( message )
	} catch ( error )
	{
		await somethingWentWrong( message, error )
	}
}

export function guildMemberAdd( member: GuildMember )
{
	defaultChannelMessage(
		member.guild,
		`Welcome to the server, ${ member }!`,
		announceEntry
	)
}

export function guildMemberRemove( member: GuildMember )
{
	defaultChannelMessage(
		member.guild,
		`${ member } has left!`,
		announceExit
	)
}

async function defaultChannelMessage(
	guild: Guild,
	message: string,
	feature: string
)
{
	const isEnabled = await isFeatureEnabled( guild, feature )

	if ( !isEnabled )
		return

	const channel = await getDefaultChannel( guild )

	if ( !channel )
		return

	channel.send( message )
}
