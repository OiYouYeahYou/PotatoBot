import { Message, GuildMember, Guild, Client } from 'discord.js'
import { somethingWentWrong, isPrefixed } from '../util'
import { getDefaultChannel, isFeatureEnabled } from '../configManager'
import { announceEntry, announceExit } from './featureEnum'
import { initAutoPurge } from '../features/channelAutoPurge'
import { prefix } from '../constants'
import { Main } from '../classes/Main'
import { everyoneResponse } from './features';
import { music } from './music';

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

	const mentionPrefix = `<@!${ app.bot.client.user.id }> `
	const musicPrefix = '\\'

	try
	{
		if ( isPrefixed( prefix, text ) )
			await app.list.run( app, message, text, prefix )
		else if ( isPrefixed( mentionPrefix, text ) )
			await app.list.run( app, message, text, mentionPrefix )
		else if ( isPrefixed( musicPrefix, text ) )
			await music.run( app, message, text, musicPrefix )
		else if ( message.mentions.everyone )
			await everyoneResponse( message )
	}
	catch ( error )
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
