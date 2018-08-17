import { Guild as GuildClass, Snowflake } from 'discord.js'
import { Document } from 'mongoose'
import { guildIDNormaliser } from '../discord/discordHelpers'
import mongoose from './client'

export const guildSchema = new mongoose.Schema({
	commands: [String],
	defaultChannel: Number,
	features: [String],
	guildID: Number,
})

interface IGuildConfig extends Document {
	guildAdd: number
	defaultChannel: number
	commands: string[]
	features: string[]
}

export type configLists = 'features' | 'commands'

export const GuildConfigModel = mongoose.model('Guild', guildSchema)

export async function findGuildConfig(
	guild: GuildClass | Snowflake
): Promise<IGuildConfig> {
	const guildID = guildIDNormaliser(guild)
	const results = await GuildConfigModel.find({ guildID })
	let result

	if (Array.isArray(results)) {
		// tslint:disable-next-line:whitespace
		;[result] = results
	} else {
		result = results
	}

	// @ts-ignore
	return Promise.resolve(result)
}
