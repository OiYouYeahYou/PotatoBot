import { configLists, findGuildConfig, GuildConfigModel } from './guild'
export { configLists } from './guild'
import {
	createPurgeConfig,
	getPurgeConfig,
	getPurgeConfigs,
	getReports,
	savePurgeReport,
} from './autoPurgeConfig'
import mongoose from './client'

import { Guild, Snowflake } from 'discord.js'
import { all } from '../discord/featureEnum'
export { IPurgeReport, IPurgeConfig } from './autoPurgeConfig'

export class Database {
	createPurgeConfig = createPurgeConfig
	findGuildConfig = findGuildConfig
	getPurgeConfig = getPurgeConfig
	getPurgeConfigs = getPurgeConfigs
	getReports = getReports
	GuildConfigModel = GuildConfigModel
	savePurgeReport = savePurgeReport

	async connect(token: string) {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(token)
		}
	}

	async disconnect() {
		await mongoose.disconnect()
	}

	async isFeatureEnabled(guild: Guild | Snowflake, feature: string) {
		return this.dbChcker(guild, feature, 'features')
	}

	async isCommandEnabled(guild: Guild | Snowflake, command: string) {
		return this.dbChcker(guild, command, 'commands')
	}

	private async dbChcker(
		guild: Guild | Snowflake,
		item: string,
		thing: configLists
	): Promise<boolean> {
		const config = await findGuildConfig(guild)

		if (!config) {
			return Promise.resolve(false)
		}

		const list: string[] = config[thing]
		const containsItem = list.includes(all) || list.includes(item)

		return Promise.resolve(containsItem)
	}
}
