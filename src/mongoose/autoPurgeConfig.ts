import mongoose from './client'
import { Document, Model } from 'mongoose'
import { IInitialPurgeReport } from '../features/channelAutoPurge';

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

const ConfigModel: Model<IPurgeConfig>
	= mongoose.model( 'AutoPurgeConfig', purgeConfigSchema )

export async function getPurgeConfigs(): Promise<IPurgeConfig[]>
{
	const configs = await ConfigModel.find( {} )
	return Array.isArray( configs ) ? configs : [ configs ]
}

// // // // // Reporting

export interface IPurgeReport extends Document
{
	channelID: string
	rawCount: number
	deletingCount: number
	deletedCount: number
	error: string
	now: number
	guildID: string
}

const purgeReportSchema = new mongoose.Schema( {
	channelID: String,
	error: String,
	now: Number,
	rawCount: Number,
	deletingCount: Number,
	deletedCount: Number,
	guildID: String
} )

const ReportModel: Model<IPurgeReport>
	= mongoose.model( 'PurgeReport', purgeReportSchema )

export async function savePurgeReport( report: IInitialPurgeReport )
{
	const doc = new ReportModel( report )
	return await doc.save()
}
