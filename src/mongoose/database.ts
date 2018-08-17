import { findGuildConfig, GuildConfigModel } from './guild'
export { configLists } from './guild'
import {
	createPurgeConfig,
	getPurgeConfig,
	getPurgeConfigs,
	getReports,
	savePurgeReport,
} from './autoPurgeConfig'
import mongoose from './client'
import { isCommandEnabled, isFeatureEnabled } from './configManager'
export { IPurgeReport, IPurgeConfig } from './autoPurgeConfig'

export class Database {
	createPurgeConfig = createPurgeConfig
	findGuildConfig = findGuildConfig
	getPurgeConfig = getPurgeConfig
	getPurgeConfigs = getPurgeConfigs
	getReports = getReports
	GuildConfigModel = GuildConfigModel
	savePurgeReport = savePurgeReport
	isFeatureEnabled = isFeatureEnabled
	isCommandEnabled = isCommandEnabled

	async connect(token: string) {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(token)
		}
	}

	async disconnect() {
		await mongoose.disconnect()
	}
}
