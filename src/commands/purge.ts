import { Attachment, DMChannel, GroupDMChannel, TextChannel }
	from 'discord.js'
import { padLeft, safeCallAsync, splitFirstWordAsNumber } from '../util'
import { createPurgeConfig, getPurgeConfig, getReports, IPurgeReport }
	from '../mongoose/autoPurgeConfig'
import { autoPurge } from '../features/channelAutoPurge'
import List from '../classes/List';
import Request from '../classes/Request';

const defaultAgeLimit = 24

export default function ( list: List )
{
	const module = list.addModule( 'autopurge', {
		help: 'Manages a guild\'s purging config',
		permission: 'owner',
		aliases: [ 'ap' ],
	} )

	module.addCommand( 'start', {
		help: 'Sets the auto purger to run in the current channel',
		func: async ( req: Request, args: string ) =>
		{
			const { id } = req.channel
			const [ config ] = await getPurgeConfig( id )
			const [ ageLimit ] = splitFirstWordAsNumber( args, defaultAgeLimit )

			if ( config )
				return await req.reply( 'This channel is already being purged' )

			await safeCallAsync( createPurgeConfig, id, ageLimit )
			await req.reply(
				`This channel will now be purged every ${ ageLimit } hours`
			)
		}
	} )

	module.addCommand( 'stop', {
		help: 'Stop the auto purger running in the current channel',
		func: async ( req: Request ) =>
		{
			const cfgs = await getPurgeConfig( req.channel.id )

			for ( const cfg of cfgs )
				await cfg.remove()

			await req.reply( 'Job done' )
		}
	} )

	module.addCommand( 'change', {
		help: 'Changes the minimum age that will be deleted',
		func: async ( req: Request, args: string ) =>
		{
			const [ config ] = await getPurgeConfig( req.channel.id )
			const { purgeOlderThan: oldMinAge } = config
			const [ newMinAge ] = splitFirstWordAsNumber( args, defaultAgeLimit )

			if ( newMinAge === oldMinAge )
				return await req.reply( 'That is already the interval' )

			config.purgeOlderThan = newMinAge
			await config.save()

			await req.reply(
				`Purging interaval changed to ${ newMinAge } hours `
				+ `from ${ oldMinAge } hours`
			)
		}
	} )

	module.addCommand( 'force', {
		help: 'Forces a Purge',
		aliases: [ 'now' ],
		func: async ( req: Request ) =>
		{
			const { channel, client } = req
			const { id } = channel
			const [ config ] = await getPurgeConfig( id )

			if ( !config )
				return req.reply( 'Auto purge is not set up for this channel' )

			await autoPurge( client, id )
		},
	} )

	module.addCommand( 'logs', {
		help: 'Provides stats about current channels purging',
		aliases: [ 'stat', 'stats', 'log', 'info' ],
		func: async ( req: Request ) =>
		{
			const { channel } = req

			if ( channel instanceof DMChannel || channel instanceof GroupDMChannel )
				return req.reply( 'Not supported in this channel' )

			const { deleted, length, config, reports } = await stats( channel )
			const response = makeResponse( length, deleted, config )
			const attch = length
				? repotsToCSV( reports, channel )
				: undefined
			await req.send( response, attch )
		}
	} )
}

async function stats( channel: TextChannel )
{
	const { id } = channel
	const [ config ] = await getPurgeConfig( channel.id )
	const reports = await getReports( id )
	const { length } = reports
	const deleted = reports.reduce(
		( acc, { deletedCount } ) =>
			deletedCount ? acc + deletedCount : acc, 0
	)

	return { deleted, length, config, reports }
}

function makeResponse( length, deleted, config )
{
	const purgedStats = length
		? `In this channel, I have deleted ${ deleted } messages and have run ${ length } times`
		: 'I have never purged in this channel, unless I have memory loss'
	const currentConfig = config
		? `And purges messages older than ${ config.purgeOlderThan } hours`
		: 'I am not curretnly auto purgeing this channel'

	return purgedStats + '. ' + currentConfig
}

function repotsToCSV( reports: IPurgeReport[], channel: TextChannel )
{
	const { name, id } = channel
	let str = 'Date,FoundMessages,Deleted Messages\n'

	for ( const item of reports )
	{
		const nowDate = new Date( item.now )
		const nowISO = nowDate.toString() !== 'Invalid Date'
			? nowDate.toISOString()
			: ''
		const foundStr = padLeft( item.rawCount, 2 )
		const deletedStr = padLeft( item.deletedCount, 2 )

		str += [ nowISO, foundStr, deletedStr ].join( ',' ) + '\n'
	}

	const bfr = new Buffer( str )
	return new Attachment( bfr, `${ name }-${ id }.csv` )
}
