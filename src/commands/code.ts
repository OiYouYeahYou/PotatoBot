import List from '../classes/List'
import Request from '../classes/Request'
import { codeWrap, splitByFirstSpace } from '../util/string'

export default function(list: List) {
	list.addCommand('code', {
		func: async (req: Request, args: string) => {
			const [lang, text] = splitByFirstSpace(args)

			return sendCode(req, text, lang)
		},
		help: 'Sends text formatted in specified language',
		usage: '<code snippet>',
	})

	list.addCommand('js', {
		func: async (req: Request, args: string) =>
			sendCode(req, args, 'javascript'),
		help: 'Sends text formatted as javascript',
		usage: '<code snippet>',
	})

	list.addCommand('ruby', {
		func: async (req: Request, args: string) => sendCode(req, args, 'ruby'),
		help: 'Sends text formatted as ruby',
		usage: '<code snippet>',
	})
}

async function sendCode(req: Request, text: string | undefined, lang: string) {
	await req.delete()

	return req.send(req.screenname + ' Sent:\n' + codeWrap(text, lang))
}
