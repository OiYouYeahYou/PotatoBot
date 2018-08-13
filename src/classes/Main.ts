import { DiscordClient } from "./Client"
import { database } from "../mongoose/database"
import List from "./List";

export class Main
{
	readonly bot: DiscordClient

	constructor(
		readonly DISCORD_TOKEN: string,
		readonly MONGO_TOKEN: string,
		readonly list: List,
		readonly music: List,
		readonly _database = database
	)
	{
		this.list = list
		this.bot = new DiscordClient( this )
	}

	async start()
	{
		await this.bot.login( this.DISCORD_TOKEN )
		await this._database.connect( this.MONGO_TOKEN )
	}

	async destroy()
	{
		await this.bot.destroy()
		await this._database.disconnect()
	}
}
