import { GuildChannel } from 'discord.js'
import List from '../classes/List'
import { DAYS, HOURS } from '../constants'
import { splitByFirstSpace } from '../util/string'

const MANAGE_MESSAGES = 'MANAGE_MESSAGES'

export default function(list: List) {
	list.addCommand('purge', {
		aliases: ['p'],
		func: async (req, args) => {
			const channel = req.channel

			if (!(channel instanceof GuildChannel)) return

			const [x] = splitByFirstSpace(args)
			const limit = Number(x)

			if (!limit || Number.isNaN(limit))
				return req.reply('You need to specify a number')

			if (!channel.permissionsFor(req.member).has(MANAGE_MESSAGES))
				return req.reply(
					'You need to have the manage message permission'
				)

			if (!channel.permissionsFor(req.bot).has(MANAGE_MESSAGES))
				return req.reply('I need to have the manage message permission')

			const messages = await channel.fetchMessages({ limit: limit + 1 })
			const fortnightAgo = Date.now() - (13 * DAYS + 23 * HOURS)
			const filtered = messages.filter(
				message =>
					!message.pinned && message.createdTimestamp > fortnightAgo
			)

			await req.channel.bulkDelete(filtered)
		},
		help: 'batch deletes a number of messages',
		permission: 'custom',
	})
}
