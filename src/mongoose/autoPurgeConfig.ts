import mongoose from './client'
import { Document } from 'mongoose'
import { Guild as GuildClass, Snowflake } from 'discord.js'
import { guildIDNormaliser } from '../util'

const purgeConfigSchema = new mongoose.Schema( {
	channelID: String,
	purgeOlderThan: Number,
} )

interface IPurgeConfig extends Document
{
	channelID?: string
	purgeOlderThan?: number
}

const PurgeConfigModel = mongoose.model( 'AutoPurgeConfig', purgeConfigSchema )

export async function getPurgeConfigs(): Promise<IPurgeConfig[]>
{
	const configs = await PurgeConfigModel.find( {} )

	return Array.isArray( configs ) ? configs : [ configs ]
}

const purgeReportSchema = new mongoose.Schema( {
	channelID: String,
	error: String,
	now: Number,
	rawCount: Number,
	deletingCount: Number,
	guildID: String
} )

const PurgeReportModel = mongoose.model( 'PurgeReport', purgeReportSchema )

export async function savePurgeReport( report )
{
	const doc = new PurgeReportModel( report )
	doc.save()
}
