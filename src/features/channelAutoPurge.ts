import { TextChannel, GuildChannel, Message, Client } from 'discord.js'
import { getPurgeConfigs, IPurgeConfig, savePurgeReport, getPurgeConfig }
	from '../mongoose/autoPurgeConfig'
import { HOURS, DAYS, AutoPurgeInterval } from '../constants'
import { safeCallAsync } from '../util'

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

export async function initAutoPurge( client: Client )
{
	const interval = AutoPurgeInterval * baseTime
	await safeCallAsync( autoPurge, client )
	client.setInterval( () => safeCallAsync( autoPurge, client ), interval )
}

export async function autoPurge( client: Client, channelIDOverride?: string )
{
	const now = Date.now()
	const reports: IInitialPurgeReport[] = []
	const purged: string[] = []
	const configs = channelIDOverride
		? await getPurgeConfig( channelIDOverride )
		: await getPurgeConfigs()

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

		let [ error, channel ] = getAndValidateChannel( client, channelID )
		let rawCount, deletingCount, guildID, deletedCount

		if ( channel )
			( { rawCount, deletingCount, error, guildID, deletedCount }
				= await purgeChannel( config, channel, now ) )

		if ( deletingCount !== 0 )
			reports.push( {
				channelID, rawCount, deletingCount, error, now, guildID, deletedCount
			} )
	}

	reports.forEach( savePurgeReport )
}

function getAndValidateChannel(
	client: Client, id: string
): [ string, TextChannel ]
{
	const { user: self, channels } = client
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

const sortByOldestFirst = ( a, b ) => a.createdTimestamp - b.createdTimestamp
