import yt = require('ytdl-core')

export class Song {
	readonly url: string
	readonly title: string
	readonly requester: string

	constructor(info: yt.videoInfo, screenname: string) {
		this.title = info.title
		this.requester = screenname
	}

	toString() {
		return `**${this.title}** - Requested by: **${this.requester}**`
	}
}
