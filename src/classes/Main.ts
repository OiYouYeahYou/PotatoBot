import { Database } from '../mongoose/database'
import { injectHandler } from '../util/tools'
import { DiscordClient } from './Client'
import List from './List'

const MainInject = { Database }

export class Main {
	readonly bot: DiscordClient
	readonly database: Database

	constructor(
		readonly DISCORD_TOKEN: string,
		readonly MONGO_TOKEN: string,
		readonly list: List,
		readonly music: List,
		inject = MainInject
	) {
		const { Database } = injectHandler(inject, MainInject)

		this.database = new Database()

		this.list = list
		this.bot = new DiscordClient(this)
	}

	async start() {
		await this.bot.login(this.DISCORD_TOKEN)
		await this.database.connect(this.MONGO_TOKEN)
	}

	async destroy() {
		await this.bot.destroy()
		await this.database.disconnect()
	}
}
