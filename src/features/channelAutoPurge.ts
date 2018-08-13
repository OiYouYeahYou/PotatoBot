import { TextChannel, GuildChannel, Message } from 'discord.js'
import { IPurgeConfig } from '../mongoose/database'
import { HOURS, DAYS, AutoPurgeInterval } from '../constants'
import { safeCallAsync } from '../util'
import { Main } from '../classes/Main';

export const baseTime = HOURS

export interface IInitialPurgeReport
{
	channelID: string
	rawCount: number
	deletingCount: number
	deletedCount: number
	error: string
	now: number
	guildID: string
}

export async function initAutoPurge( app: Main )
{
	const interval = AutoPurgeInterval * baseTime
	await safeCallAsync( autoPurge, app )
	app.bot.client.setInterval(
		() => safeCallAsync( autoPurge, app ), interval
	)
}

export async function autoPurge( app: Main, channelIDOverride?: string )
{
	const now = Date.now()
	const reports: IInitialPurgeReport[] = []
	const purged: string[] = []
	const configs = channelIDOverride
		? await app._database.getPurgeConfig( channelIDOverride )
		: await app._database.getPurgeConfigs()

	for ( const config of configs )
	{
		const { channelID } = config

		if ( purged.includes( channelID ) )
		{
			config.remove()
			continue
		}
		else
			purged.push( channelID )

		let [ error, channel ] = getAndValidateChannel( app, channelID )
		let rawCount, deletingCount, guildID, deletedCount

		if ( channel )
			( { rawCount, deletingCount, error, guildID, deletedCount }
				= await purgeChannel( config, channel, now ) )

		if ( deletingCount !== 0 )
			reports.push( {
				channelID, rawCount, deletingCount, error, now, guildID, deletedCount
			} )
	}

	reports.forEach( app._database.savePurgeReport )
}

function getAndValidateChannel(
	app: Main,
	id: string
): [ string, TextChannel ]
{
	const { user: self, channels } = app.bot.client
	const channel = channels.find( 'id', id )

	if ( !channel )
		return [ 'Missing Channel', undefined ]

	if ( !( channel instanceof TextChannel ) )
		return [ 'Channel isn\'t a TextChannel', undefined ]

	if ( !( channel instanceof GuildChannel ) )
		return [ 'Channel isn\'t a GuildChannel', undefined ]

	const permissions = channel.permissionsFor( self )
	const canManageMessages = permissions.has( 'MANAGE_MESSAGES' )

	if ( !canManageMessages )
		return [ 'Inagequated permission', undefined ]

	return [ undefined, channel ]
}

async function purgeChannel(
	{ channelID, purgeOlderThan }: IPurgeConfig,
	channel: TextChannel,
	now: number
): Promise<IInitialPurgeReport>
{
	const messageCollection = await channel.fetchMessages( { limit: 50 } )
	const messages = messageCollection.array()
	const deletables = filterDeletables( messages, purgeOlderThan, now )

	const rawCount = messages.length
	const deletingCount = deletables.length

	const [ error, deleted ] = await safeCallAsync(
		() => channel.bulkDelete( deletables )
	)

	return {
		channelID, rawCount, deletingCount, error, now,
		deletedCount: deleted.size,
		guildID: channel.guild.id,
	}
}

function filterDeletables( messages: Message[], minAge: number, now: number )
{
	const lower = now - ( minAge * baseTime )
	const upper = now - ( ( 14 * DAYS ) - 1 * HOURS )

	const deletables = messages.filter(
		( { createdTimestamp: age, deletable, pinned } ) =>
			!pinned && deletable && ( lower > age ) && ( age > upper )
	)

	return deletables.sort( sortByOldestFirst )
}

interface HasCreatedTimestamp { createdTimestamp: number }
const sortByOldestFirst = ( a: HasCreatedTimestamp, b: HasCreatedTimestamp ) =>
	a.createdTimestamp - b.createdTimestamp
