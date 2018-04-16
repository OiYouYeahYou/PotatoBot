import { Bot } from "./Client"
import mongoose from "../mongoose/client"
import { Connection, Mongoose } from "mongoose"
import List from "./List";

export class Main
{
	constructor( discord: string, monogo: string, list: List )
	{
		this.list = list
		this.bot = new Bot( this )
		this.mongoose = mongoose
		this.db = this.mongoose.connection

		this.DISCORD_TOKEN = discord
		this.MONGO_TOKEN = monogo
	}

	readonly bot: Bot
	readonly list: List
	readonly db: Connection
	readonly mongoose: Mongoose

	private readonly DISCORD_TOKEN: string
	private readonly MONGO_TOKEN: string

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
