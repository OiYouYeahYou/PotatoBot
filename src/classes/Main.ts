import { Bot } from "./Client"
import mongoose from "../mongoose/client"
import { Connection, Mongoose } from "mongoose"
import List from "./List";

export class Main
{
	readonly bot: Bot
	readonly db: Connection
	readonly mongoose: Mongoose

	constructor(
		readonly DISCORD_TOKEN: string,
		readonly MONGO_TOKEN: string,
		readonly list: List
	)
	{
		this.list = list
		this.bot = new Bot( this )
		this.mongoose = mongoose
		this.db = this.mongoose.connection
	}

	async start()
	{
		await this.bot.login( this.DISCORD_TOKEN )

		if ( this.db.readyState === 0 )
			await mongoose.connect( this.MONGO_TOKEN )
	}

	async destroy()
	{
		await this.bot.destroy()
		await mongoose.disconnect()
	}
}
