import List from '../classes/List'
import Request from '../classes/Request'

export default function(list: List) {
	list.addCommand('never', {
		func: never,
		help: 'Displays the number of people who have not sent a message',
	})
}

export async function never(req: Request) {
	const { guild } = req
	const { members } = guild

	const inactive = members.filterArray(
		member => (member.lastMessage ? false : true)
	)

	return req.reply(inactive.length)
}
