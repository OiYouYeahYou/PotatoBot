import { Document, Model } from 'mongoose'
import { IInitialPurgeReport } from '../features/channelAutoPurge'
import mongoose from './client'

// // // // // Configs

const purgeConfigSchema = new mongoose.Schema({
	channelID: String,
	purgeOlderThan: Number,
})

export interface IPurgeConfig extends Document {
	channelID?: string
	purgeOlderThan?: number
}

const ConfigModel: Model<IPurgeConfig> = mongoose.model(
	'AutoPurgeConfig',
	purgeConfigSchema
)

export async function getPurgeConfigs(): Promise<IPurgeConfig[]> {
	const configs = await ConfigModel.find({})
	return Array.isArray(configs) ? configs : [configs]
}

export async function getPurgeConfig(
	channelID: string
): Promise<IPurgeConfig[]> {
	const config = await ConfigModel.find({ channelID })
	return Array.isArray(config) ? config : [config]
}

export async function createPurgeConfig(
	channelID: string,
	purgeOlderThan: number
) {
	const doc = new ConfigModel({ channelID, purgeOlderThan })
	return doc.save()
}

// // // // // Reporting

export interface IPurgeReport extends Document {
	channelID: string
	rawCount: number
	deletingCount: number
	deletedCount: number
	error: string
	now: number
	guildID: string
}

const purgeReportSchema = new mongoose.Schema({
	channelID: String,
	deletedCount: Number,
	deletingCount: Number,
	error: String,
	guildID: String,
	now: Number,
	rawCount: Number,
})

const ReportModel: Model<IPurgeReport> = mongoose.model(
	'PurgeReport',
	purgeReportSchema
)

export async function savePurgeReport(report: IInitialPurgeReport) {
	const doc = new ReportModel(report)
	return doc.save()
}

export async function getReports(channelID: string): Promise<IPurgeReport[]> {
	const report = await ReportModel.find({ channelID })
	return Array.isArray(report) ? report : [report]
}
