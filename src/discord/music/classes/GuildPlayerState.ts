import { Guild, GuildMember, Message, StreamDispatcher } from 'discord.js'
import yt = require('ytdl-core')
import { codeWrap } from '../../../util/string'
import { Song } from './Song'
import { Store } from './Store'

const ytdOptions: yt.downloadOptions = { filter: 'audioonly' }
const streamOptions = { passes: 1 }

interface IChannel {
	send(message: string): Promise<Message | Message[]>
}

export class GuildPlayerState {
	songs: Song[] = []
	current: Song
	playing: boolean = false

	private dispatcher: StreamDispatcher
	private _textChannel: IChannel

	constructor(private readonly store: Store, readonly guild: Guild) {}

	async add(url: string, screenname: string) {
		try {
			var info = await yt.getInfo(url) // tslint:disable-line
		} catch (err) {
			return 'Unable to get video'
		}

		const song = new Song(info, screenname)
		this.songs.push(song)

		return `added **${info.title}** to the queue`
	}

	async playNext() {
		const song = this.shift()
		if (!song) {
			// TODO: Set timer, to leave after a period of time
			return this.leave('Queue is empty')
		}

		this.playing = true

		await this.nowPlaying()
		this.createDispatcher(song)
	}

	nowPlaying() {
		const { next, current } = this

		const responses = ['Playing: ' + current.toString()]
		if (next) {
			responses.push('Next: ' + next.toString())
		}

		return this.textChannel.send(responses.join('\n'))
	}

	dispatcherCall(method: 'pause' | 'resume' | 'end') {
		return this.dispatcher[method]()
	}

	get next() {
		return this.songs[0]
	}

	get connection() {
		return this.guild.voiceConnection
	}

	get voiceChannel() {
		return this.connection && this.connection.channel
	}

	get textChannel() {
		return this._textChannel
	}

	set textChannel(channel: IChannel) {
		this._textChannel = channel
	}

	isBusy() {
		return (
			this.isPlaying() &&
			this.voiceChannel &&
			this.voiceChannel.members.size > 1
		)
	}

	getVol() {
		return this.dispatcher.volume * 100
	}

	setVolume(vol: number) {
		vol = Math.round(vol)
		vol = Math.min(vol, 200)
		vol = Math.max(vol, 0)
		vol = vol / 100

		const old = this.getVol()

		this.dispatcher.setVolume(vol)

		return [old, vol]
	}

	isPlaying() {
		return this.playing
	}

	destroy() {
		this.songs.length = 0
		this.playing = false
		this.current = null
		this.dispatcher = null
	}

	queueString() {
		const { songs, guild } = this
		const heading = `__**${guild.name}'s Music Queue:**__`
		const { length: queueLength } = songs

		if (0 !== queueLength) {
			return `${heading} No songs in the queue`
		}

		const limiter = 15
		const songsToList = songs
			.slice(0, limiter)
			.map((song: Song, i: number) => `${i}. ${song}`)
			.join('\n')
		const wrappedSongs = codeWrap(songsToList)
		const isBigQueue = queueLength > limiter
		const trimmingNote = isBigQueue ? `*[${limiter} shown]*` : ''
		const plural = queueLength ? 's' : ''

		return (
			`${heading} **${queueLength}** song${plural} queued ${trimmingNote}` +
			'\n\n' +
			wrappedSongs
		)
	}

	async join(member: GuildMember) {
		if (!member.voiceChannel) {
			return 'You need to be connected to a voice channel'
		}

		if (this.voiceChannel.id === member.voiceChannel.id) {
			return
		}

		if (this.isBusy()) {
			return 'Already connected to another channel'
		}

		try {
			await member.voiceChannel.join()
		} catch (error) {
			return 'Cannot connect to that channel'
		}
	}

	private shift() {
		return (this.current = this.songs.shift())
	}

	private async leave(msg?: string) {
		this.store.destroy(this.guild)
		this.voiceChannel.leave()

		if (msg) {
			return this.textChannel.send(msg)
		}
	}

	private createDispatcher({ url }: Song) {
		this.dispatcher = this.connection.playStream(
			yt(url, ytdOptions),
			streamOptions
		)

		this.dispatcher.on('end', async () => this.playNext())
		this.dispatcher.on('error', async err => {
			await this.textChannel.send('error: ' + err)
			await this.playNext()
		})
	}
}
