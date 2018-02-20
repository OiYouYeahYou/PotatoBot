import Request from '../classes/Request';
import List from '../classes/List';

export default function ( list: List )
{
	list.addCommand( 'shutup', {
		func: async ( req: Request ) =>
			req.reply( 'Bitch Noooo!!!!' ),
		help: 'Returns a witty response',
	} )
}
