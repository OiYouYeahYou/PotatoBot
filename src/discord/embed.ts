import { RichEmbed } from 'discord.js'

export function richEmbed()
{
	var embed = new RichEmbed()
		.setAuthor( 'Potato Bot' )
		.setColor( 0x00AE86 )
		.setFooter( 'Yours truly, your friendly neighbourhood bot' )

	return embed
}
