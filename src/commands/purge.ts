import List from "../classes/List"
import { splitByFirstSpace } from "../util"
import { GuildChannel } from "discord.js"
import { DAYS, HOURS } from "../constants"

const MANAGE_MESSAGES = 'MANAGE_MESSAGES'

export default function ( list: List )
{
	list.addCommand( 'purge', {
		help: 'batch deletes a number of messages',
		aliases: [ 'p' ],
		permission: 'custom',
		func: async ( req, args ) =>
		{
			const channel = req.message.channel

			if ( !( channel instanceof GuildChannel ) )
				return

			const [ x ] = splitByFirstSpace( args )
			const limit = Number( x )

			if ( !limit || Number.isNaN( limit ) )
				return req.reply( 'You need to specify a number' )

			if ( !channel.permissionsFor( req.member ).has( MANAGE_MESSAGES ) )
				return req.reply(
					'You need to have the manage message permission'
				)

			if ( !channel.permissionsFor( req.bot ).has( MANAGE_MESSAGES ) )
				return req.reply(
					'I need to have the manage message permission'
				)

			const messages = await channel.fetchMessages( { limit: limit + 1 } )
			const fortnightAgo = Date.now() - ( ( 13 * DAYS ) + ( 23 * HOURS ) )
			const filtered = messages.filter( message =>
				!message.pinned && ( message.createdTimestamp > fortnightAgo )
			)

			await req.channel.bulkDelete( filtered )
		}
	} )
}
