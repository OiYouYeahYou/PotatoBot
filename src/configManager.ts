import { Guild, Snowflake } from 'discord.js'
import { findGuildConfig, configLists } from './mongoose/guild'
import { all } from './discord/featureEnum'

export async function isFeatureEnabled(
	guild: Guild | Snowflake, feature: string
)
{
	return await dbChcker( guild, feature, 'features' )
}

export async function isCommandEnabled(
	guild: Guild | Snowflake, command: string
)
{
	return await dbChcker( guild, command, 'commands' )
}

async function dbChcker(
	guild: Guild | Snowflake,
	item: string,
	thing: configLists
): Promise<boolean>
{
	const config = await findGuildConfig( guild )

	if ( !config )
		return Promise.resolve( false )

	const list: string[] = config[ thing ]
	const containsItem = list.includes( all ) || list.includes( item )

	return Promise.resolve( containsItem )
}
