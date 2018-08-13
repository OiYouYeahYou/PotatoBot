
import { findGuildConfig, GuildConfigModel } from './guild';
export { configLists } from './guild';
import { createPurgeConfig, getPurgeConfig, getPurgeConfigs, getReports, savePurgeReport } from './autoPurgeConfig';
import { isFeatureEnabled, isCommandEnabled } from '../configManager';
import mongoose from './client';
export { IPurgeReport, IPurgeConfig } from './autoPurgeConfig';

export const database = {
	findGuildConfig,
	createPurgeConfig,
	getPurgeConfig,
	getPurgeConfigs,
	savePurgeReport,
	getReports,
	GuildConfigModel,
	isFeatureEnabled,
	isCommandEnabled,

	async connect( token: string )
	{
		if ( mongoose.connection.readyState === 0 )
			await mongoose.connect( token )
	},

	async disconnect()
	{
		await mongoose.disconnect()
	}
}
