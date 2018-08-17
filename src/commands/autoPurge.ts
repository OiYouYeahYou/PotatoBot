import { Attachment, DMChannel, GroupDMChannel, TextChannel } from 'discord.js'
import List from '../classes/List'
import Request from '../classes/Request'
import { autoPurge } from '../features/channelAutoPurge'
import { IPurgeConfig, IPurgeReport } from '../mongoose/database'
import { padLeft, splitFirstWordAsNumber } from '../util/string'
import { safeCallAsync } from '../util/tools'

const defaultAgeLimit = 24

export default function(list: List) {
	const module = list.addModule('autopurge', {
		aliases: ['ap'],
		help: "Manages a guild's purging config",
		permission: 'owner',
	})

	module.addCommand('start', {
		func: async (req: Request, args: string) => {
			const { id } = req.channel
			const [config] = await req.app.database.getPurgeConfig(id)
			const [ageLimit] = splitFirstWordAsNumber(args, defaultAgeLimit)

			if (config) {
				return req.reply('This channel is already being purged')
			}

			await safeCallAsync(
				req.app.database.createPurgeConfig,
				id,
				ageLimit
			)
			await req.reply(
				`This channel will now be purged every ${ageLimit} hours`
			)
		},
		help: 'Sets the auto purger to run in the current channel',
	})

	module.addCommand('stop', {
		func: async (req: Request) => {
			const cfgs = await req.app.database.getPurgeConfig(req.channel.id)

			for (const cfg of cfgs) {
				await cfg.remove()
			}

			await req.reply('Job done')
		},
		help: 'Stop the auto purger running in the current channel',
	})

	module.addCommand('change', {
		func: async (req: Request, args: string) => {
			const [config] = await req.app.database.getPurgeConfig(
				req.channel.id
			)
			const { purgeOlderThan: oldMinAge } = config
			const [newMinAge] = splitFirstWordAsNumber(args, defaultAgeLimit)

			if (newMinAge === oldMinAge) {
				return req.reply('That is already the interval')
			}

			config.purgeOlderThan = newMinAge
			await config.save()

			await req.reply(
				`Purging interaval changed to ${newMinAge} hours ` +
					`from ${oldMinAge} hours`
			)
		},
		help: 'Changes the minimum age that will be deleted',
	})

	module.addCommand('force', {
		aliases: ['now'],
		func: async (req: Request) => {
			const { channel, app } = req
			const { id } = channel
			const [config] = await req.app.database.getPurgeConfig(id)

			if (!config) {
				return req.reply('Auto purge is not set up for this channel')
			}

			await autoPurge(app, id)
		},
		help: 'Forces a Purge',
	})

	module.addCommand('logs', {
		aliases: ['stat', 'stats', 'log', 'info'],
		func: async (req: Request) => {
			const { channel } = req

			if (
				channel instanceof DMChannel ||
				channel instanceof GroupDMChannel
			) {
				return req.reply('Not supported in this channel')
			}

			const { deleted, length, config, reports } = await stats(
				req,
				channel
			)
			const response = makeResponse(length, deleted, config)
			const attch = length ? repotsToCSV(reports, channel) : undefined
			await req.send(response, attch)
		},
		help: 'Provides stats about current channels purging',
	})
}

async function stats(req: Request, channel: TextChannel) {
	const { id } = channel
	const [config] = await req.app.database.getPurgeConfig(channel.id)
	const reports = await req.app.database.getReports(id)
	const { length } = reports
	const deleted = reports.reduce(
		(acc, { deletedCount }) => (deletedCount ? acc + deletedCount : acc),
		0
	)

	return { deleted, length, config, reports }
}

function makeResponse(length: number, deleted: number, config: IPurgeConfig) {
	const purgedStats = length
		? `In this channel, I have deleted ${deleted} messages and have run ${length} times`
		: 'I have never purged in this channel, unless I have memory loss'
	const currentConfig = config
		? `And purging messages older than ${config.purgeOlderThan} hours`
		: 'I am not currently auto purging this channel'

	return purgedStats + '. ' + currentConfig
}

function repotsToCSV(reports: IPurgeReport[], channel: TextChannel) {
	const { name, id } = channel
	let str = 'Date,FoundMessages,Deleted Messages\n'

	for (const item of reports) {
		const nowDate = new Date(item.now)
		const nowISO =
			nowDate.toString() !== 'Invalid Date' ? nowDate.toISOString() : ''
		const foundStr = padLeft(item.rawCount, 2)
		const deletedStr = padLeft(item.deletedCount, 2)

		str += [nowISO, foundStr, deletedStr].join(',') + '\n'
	}

	const bfr = new Buffer(str)
	return new Attachment(bfr, `${name}-${id}.csv`)
}
