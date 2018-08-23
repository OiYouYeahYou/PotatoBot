import { Guild, Message, Snowflake, VoiceChannel } from 'discord.js'
import { TEN_SECONDS } from '../constants'
import { timer } from '../util/tools'

/**
 * Finds a Voice Channel in a guild by name
 * @param guild
 * @param name
 */
export function findVoiceChannel(guild: Guild, name: string): VoiceChannel {
	const channel = guild.channels.find('name', name)

	if (channel && channel instanceof VoiceChannel) {
		return channel
	}
}

/**
 * Sends a reply that self destructs
 * @param message
 * @param text
 */
export async function destructingReply(message: Message, text: string) {
	const msg = await message.reply(text)

	await timer(TEN_SECONDS)

	try {
		// @ts-ignore
		await msg.delete()
	} catch (error) {
		// empty
	}
}

export function guildIDNormaliser(guild: Guild | Snowflake): number {
	return Number(guild instanceof Guild ? guild.id : guild)
}
