import { isNull } from 'util'
import List from '../../classes/List'
import Request from '../../classes/Request'
import help from '../../commands/help'
import { splitFirstWordAsNumber } from '../../util/string'
import { Store } from './classes/Store'

export const store = new Store()
export const music = new List()

help(music)

music.addCommand('play', {
	async func(req: Request, url?: string) {
		if (!store._get(req).connection) {
			const error = await store.join(req)

			if (error) {
				return req.send(error)
			}
		}

		if (url) {
			await req.send(await store.add(req, url))
		}

		const state = store._get(req)

		if (!state.playing) {
			await store.playNext(req)
		}
	},
	help: 'Plays, adds, joins or resumes the player',
	usage: '[youtube link]',
})

music.addCommand('join', {
	aliases: ['summon'],
	async func(req: Request) {
		const error = await store.join(req)

		if (error) {
			await req.send(error)
		}
	},
	help: 'Brings the bot to the voice channel',
})

music.addCommand('add', {
	async func(req: Request, url: string) {
		if (!url) {
			return req.usage('Missing url')
		}

		return req.send(await store.add(req, url))
	},
	help: 'Adds tracks to the playlist',
	usage: '<youtube link>',
})

music.addCommand('queue', {
	aliases: ['q'],
	func: async req => {
		const queueString = store.queueString(req)
		req.send(queueString)
	},
	help: 'Displays the playlist',
})

music.addCommand('pause', {
	func: req => store.dispatcherCall(req, 'paused', 'pause'),
	help: 'Pauses the player',
})

music.addCommand('resume', {
	func: req => store.dispatcherCall(req, 'resumed', 'resume'),
	help: 'Resumes the player',
})

music.addCommand('skip', {
	aliases: ['next'],
	func: req => store.dispatcherCall(req, 'skipped', 'end'),
	help: 'Goes to the next song',
})

music.addCommand('volume', {
	aliases: ['vol'],
	func(req: Request, args?: string) {
		const state = store.get(req)
		if (!state) {
			return req.send('Player has not been started')
		}

		const [vol] = splitFirstWordAsNumber(args, null)

		if (!isNull(vol)) {
			const [old, neu] = state.setVolume(vol)
			return req.send(`Volume: ${neu}% from ${old}%`)
		} else {
			const current = state.getVol()
			return req.send(`Volume: ${current}%`)
		}
	},
	help: 'Manages bot volume',
	usage: '[new volume]',
})

music.addCommand('now', {
	aliases: ['np'],
	func: req => req.send(store._get(req).nowPlaying()),
	help: 'What is the current song',
})
