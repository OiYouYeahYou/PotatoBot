import mongoose from './client'
import { Document } from 'mongoose'
import { IPurgeReport } from '../features/channelAutoPurge';

// // // // // Configs

const purgeConfigSchema = new mongoose.Schema( {
	channelID: String,
	purgeOlderThan: Number,
} )

export interface IPurgeConfig extends Document
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

// // // // // Reporting

const purgeReportSchema = new mongoose.Schema( {
	channelID: String,
	error: String,
	now: Number,
	rawCount: Number,
	deletingCount: Number,
	guildID: String
} )

const PurgeReportModel = mongoose.model( 'PurgeReport', purgeReportSchema )

export async function savePurgeReport( report: IPurgeReport )
{
	const doc = new PurgeReportModel( report )
	doc.save()
}
