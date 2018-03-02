// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install()

import { Message, GuildMember, Guild } from 'discord.js'
import { somethingWentWrong, safeCallAsync } from '../util'
import { getDefaultChannel, isFeatureEnabled } from '../configManager'
import { announceEntry, announceExit } from './featureEnum'
import { initAutoPurge } from '../features/channelAutoPurge'
import { messageHandler, isPrefixed } from './messageEvent';
import { prefix } from '../constants';

export const ready = ( client ) =>
{
	console.log( 'Discord client is ready!' )
	initAutoPurge( client )
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
	const text = message.content.trim()

	if ( message.author.bot )
		return

	if ( !isPrefixed( prefix, text ) && !message.mentions.everyone )
		return

	const [ error ]
		= await safeCallAsync( messageHandler, message, text, prefix )
	if ( error )
		await somethingWentWrong( message, error )
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
