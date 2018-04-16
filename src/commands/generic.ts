import Request from '../classes/Request'
import List from '../classes/List';

export default function ( list: List )
{
	list.addCommand( 'avatar', {
		func: async ( req: Request ) =>
			await req.reply( req.author.avatarURL ),
		help: 'Returns the users avatar',
	} )

	list.addCommand( 'ping', {
		func: async ( req: Request ) =>
			req.reply(
				`pong: ${ parseInt( req.client.ping.toString() ) } ms`
			),
		help: 'Tests latency of the server',
		aliases: [ 'pong' ],
	} )
}
