import List from "../classes/List"
import { splitByFirstSpace } from "../util"

export default function ( list: List )
{
	list.addCommand( 'purge', {
		help: 'batch deletes a number of messages',
		aliases: [ 'p' ],
		permission: 'admin',
		func: async ( req, args ) =>
		{
			const [ x ] = splitByFirstSpace( args )
			const limit = Number( x )

			if ( !limit || Number.isNaN( limit ) )
				return req.reply( 'You need to specify a number' )

			const messages = await req.channel.fetchMessages( { limit } )
			await req.channel.bulkDelete( messages )
		}
	} )
}
