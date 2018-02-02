import mongoose from './client'
import { Document } from 'mongoose'
import { Guild as GuildClass, Snowflake } from 'discord.js'
import { guildIDNormaliser } from '../util'

export const guildSchema = new mongoose.Schema( {
	guildID: Number,
	defaultChannel: Number,
	commands: [ String ],
	features: [ String ],
} )

interface IGuildConfig extends Document
{
	guildAdd: number
	defaultChannel: number,
	commands: string[],
	features: string[],
}

export type configLists = 'features' | 'commands'

export const GuildConfigModel = mongoose.model( 'Guild', guildSchema )

export async function findGuildConfig( guild: GuildClass | Snowflake
): Promise<IGuildConfig>
{
	const guildID = guildIDNormaliser( guild )
	const results = await GuildConfigModel.find( { guildID } )
	let result

	if ( Array.isArray( results ) )
	{
		[ result ] = results
	} else
	{
		result = results
	}

	return Promise.resolve( result )
}
