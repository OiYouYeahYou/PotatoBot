import { Message } from 'discord.js'
import { isFeatureEnabled } from '../configManager'
import { deleteEM, scoldEM, dareEM } from './featureEnum'

export async function everyoneResponse( message: Message )
{
	const { guild, deletable } = message
	const isDeleting = await isFeatureEnabled( guild, deleteEM )
	const isScolding = await isFeatureEnabled( guild, scoldEM )

	if ( deletable && isDeleting )
		await message.delete()

	if ( isScolding )
	{
		const file = await isFeatureEnabled( guild, dareEM )
			? { file: 'https://cdn.weeb.sh/images/ryKLMPEj-.png', }
			: undefined

		await message.reply( 'Don\'t mention everyone!!', file )
	}
}
