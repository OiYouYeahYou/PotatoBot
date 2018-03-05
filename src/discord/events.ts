import { Message, GuildMember, Guild, Client } from 'discord.js'
import { somethingWentWrong, safeCallAsync } from '../util'
import { getDefaultChannel, isFeatureEnabled } from '../configManager'
import { announceEntry, announceExit } from './featureEnum'
import { initAutoPurge } from '../features/channelAutoPurge'
import { messageHandler, isPrefixed } from './messageEvent'
import { prefix } from '../constants'
import { Main } from '../classes/Main'

export async function ready( client: Client )
{
	const invite = await client.generateInvite()

	console.log(
		'Discord client is ready!\n'
		+ 'Bot invite: ' + invite
	)
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

export async function messageRecived( app: Main, message: Message )
{
	const text = message.content.trim()

	if ( message.author.bot )
		return

	if ( !isPrefixed( prefix, text ) && !message.mentions.everyone )
		return

	const [ error ]
		= await safeCallAsync( messageHandler, app, message, text, prefix )
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
