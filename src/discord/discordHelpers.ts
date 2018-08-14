import { Guild, Message, VoiceChannel, Snowflake } from 'discord.js'
import { randomString } from '../util/string';
import { timer } from '../util/tools';
import { TEN_SECONDS } from '../constants';

/**
 * Finds a Voice Channel in a guild by name
 * @param guild
 * @param name
 */
export function findVoiceChannel( guild: Guild, name: string ): VoiceChannel
{
	var channel = guild.channels.find( 'name', name )

	if ( channel && channel instanceof VoiceChannel )
		return channel
}

/**
 * Sends a reply that self destructs
 * @param message
 * @param text
 */
export async function destructingReply( message: Message, text: string )
{
	const msg = await message.reply( text )

	await timer( TEN_SECONDS )

	try
	{
		// @ts-ignore
		await msg.delete()
	} catch ( error )
	{
		console.error( error )
	}
}

/**
 * Replies to a user that something went wrong, with a reference that can be referenced to server logs
 * @param message
 * @param err
 */
export async function somethingWentWrong( message: Message, err: any )
{
	const id = randomString( 6 )

	if ( err instanceof Error )
		err.message += ` (Event: ${ id })`

	console.log( err )
	return destructingReply( message, `Something went wrong (Event: ${ id })` )
}

export function guildIDNormaliser( guild: Guild | Snowflake ): number
{
	return Number( guild instanceof Guild ? guild.id : guild )
}
