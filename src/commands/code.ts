import Request from '../classes/Request';
import { splitByFirstSpace, destructingReply, somethingWentWrong } from '../util'
import List from '../classes/List';

export default function ( list: List )
{
	list.addCommand( 'code', {
		func: async ( req: Request, args: string ) =>
		{
			const [ lang, text ] = splitByFirstSpace( args )

			return sendCode( req, text, lang )
		},
		help: 'Sends text formatted in specified language',
		usage: '<code snippet>',
	} )

	list.addCommand( 'js', {
		func: async ( req: Request, args: string ) =>
			sendCode( req, args, 'javascript' ),
		help: 'Sends text formatted as javascript',
		usage: '<code snippet>',
	} )

	list.addCommand( 'ruby', {
		func: async ( req: Request, args: string ) =>
			sendCode( req, args, 'ruby' ),
		help: 'Sends text formatted as ruby',
		usage: '<code snippet>',
	} )
}

async function sendCode( req: Request, text: string | undefined, lang )
{
	await req.delete()

	if ( !text || !text.trim() )
		return req.destructingReply( 'No code was recieved' )

	return req.sendCode( lang, text )
}
