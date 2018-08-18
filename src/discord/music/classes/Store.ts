import { Guild } from 'discord.js'
import Request from '../../../classes/Request'
import { GuildPlayerState } from './GuildPlayerState'

export class Store {
	private states: { [key: string]: GuildPlayerState } = {}

	get({ guild: { id } }: Request): GuildPlayerState | false {
		return this.states[id]
	}

	_get({ guild, channel }: Request) {
		const { id } = guild
		let state = this.states[id]

		if (!state) {
			state = this.states[id] = new GuildPlayerState(this, guild)
		}

		state.textChannel = channel
		return state
	}

	add(req: Request, url: string) {
		return this._get(req).add(url, req.screenname)
	}

	playNext(req: Request) {
		return this._get(req).playNext()
	}

	destroy({ id }: Guild) {
		// Dep, but this may be useful in the future
		// this.states[id].destroy()
		this.states[id] = null
	}

	setVolume(req: Request, vol: number) {
		return this._get(req).setVolume(vol)
	}

	getVol(req: Request) {
		return this._get(req).getVol()
	}

	isPlaying(req: Request) {
		return this._get(req).isPlaying()
	}

	isBusy(req: Request) {
		return this._get(req).isBusy()
	}

	join(req: Request) {
		return this._get(req).join(req.member)
	}

	queueString(req: Request) {
		return this._get(req).queueString()
	}

	async dispatcherCall(
		req: Request,
		success: string,
		prop: 'pause' | 'resume' | 'end'
	) {
		const state = this.get(req)
		if (!state) {
			return req.send('Player has not been started')
		}

		state.dispatcherCall(prop)
		return req.send(success)
	}
}
