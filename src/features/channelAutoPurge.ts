import { TextChannel, GuildChannel, Message } from "discord.js";
import { client } from "../discord/client";
import { richEmbed } from "../discord/embed";
import { getPurgeConfigs, IPurgeConfig, savePurgeReport } from "../mongoose/autoPurgeConfig";
import { HOURS, DAYS, SECONDS, AutoPurgeInterval } from "../constants";
import { noop, safeCallAsync } from "../util";

export const baseTime = HOURS

export interface IPurgeReport
{
	channelID: string
	rawCount: number
	deletingCount: number
	error: string
	now: number
	guildID: string
}

export async function initAutoPurge()
{
	const interval = AutoPurgeInterval * baseTime
	await safeCallAsync( autoPurge )
	client.setInterval( () => safeCallAsync( autoPurge ), interval )
}

export async function autoPurge()
{
	const now = Date.now()
	const reports: IPurgeReport[] = []
	const configs = await getPurgeConfigs()

	for ( const config of configs )
	{
		const { channelID } = config
		let [ error, channel ] = getAndValidateChannel( channelID )
		let rawCount, deletingCount, guildID

		if ( channel )
		{
			const report = await purgeChannel( config, channel, now );
			( { rawCount, deletingCount, error, guildID } = report )

			await purgeMessage( channel, report )
		}

		reports.push(
			{ channelID, rawCount, deletingCount, error, now, guildID }
		)
	}

	reports.forEach( savePurgeReport )
}

function getAndValidateChannel( id: string ): [ string, TextChannel ]
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
): Promise<IPurgeReport>
{
	const messageCollection = await channel.fetchMessages( { limit: 50 } )
	const messages = messageCollection.array()
	const deletables = filterDeletables( messages, purgeOlderThan, now )

	const rawCount = messages.length
	const deletingCount = deletables.length

	const [ error ] = await safeCallAsync(
		() => channel.bulkDelete( deletables )
	)

	const report = {
		channelID, rawCount, deletingCount, error, now,
		guildID: channel.guild.id,
	}

	return report
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

async function purgeMessage( channel: TextChannel, report: IPurgeReport )
{
	if ( !report.deletingCount )
		return

	const channlePermissions = channel.permissionsFor( client.user )
	const canSendMessages = channlePermissions.has( 'SEND_MESSAGES' )

	if ( !canSendMessages )
		return

	const embed = richEmbed()
	embed.setTitle( 'This channel has been auto purged' )
	embed.addField( 'Messages Found', report.rawCount )
	embed.addField( 'Messages Deleted', report.deletingCount )

	if ( report.error )
		embed.addField( 'Errors Encountered', report.error )

	const message = await channel.send( [ 'a', 'b', 'c' ] )
	// @ts-ignore --- We are sending one message, so deleteing one message
	message.delete( 30 * SECONDS ).catch( noop )
}