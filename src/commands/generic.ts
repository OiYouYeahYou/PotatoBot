import List from '../classes/List'
import Request from '../classes/Request'

export default function(list: List) {
	list.addCommand('avatar', {
		func: async (req: Request) => req.reply(req.author.avatarURL),
		help: 'Returns the users avatar',
	})

	list.addCommand('ping', {
		aliases: ['pong'],
		func: async (req: Request) =>
			req.reply(`pong: ${parseInt(req.client.ping.toString(), 10)} ms`),
		help: 'Tests latency of the server',
	})
}
