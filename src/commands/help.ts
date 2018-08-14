import Request from '../classes/Request'
import { codeWrap } from '../util/string'
import Module from '../classes/Module'
import List from '../classes/List'

export default function ( list: List )
{
	list.addCommand( 'help', {
		func: helpFunction,
		help: 'Provides information about a command',
		usage: '<command>',
	} )

	list.addCommand( 'list', {
		func: async ( req: Request, args ) =>
		{
			const [ err, response ] = treeWalker( req.list, args )

			if ( err )
				await req.send( err )

			return req.send( response )
		},
		help: 'Provides a list of commands',
	} )
}

export async function helpFunction( req: Request, text: string )
{
	const commands = text.replace( / +(?= )/g, '' ).toLowerCase().split( ' ' )

	if ( !commands.length )
		return missingArguments( req )
	else if ( commands.length > 5 )
		return req.reply( 'You have requested to many arguments' )

	for ( const command of commands )
	{
		if ( !command )
			continue

		const wrapper = req.list.getCommandWrapper( command )

		if ( wrapper )
			return req.embed()
				.setTitle( `Help : ${ command }` )
				.addField( 'Usage', req.prefix + wrapper.usage )
				.addField( 'Purpose', wrapper.help )
				.send()
		else
			return req.embed()
				.setTitle( `Help : ${ command } is not recognised` )
				.setDescription( 'Try using list to find your command' )
				.send()
	}
}

function treeWalker( list: List, args: string )
{
	const argsArray = args.replace( / +(?= )/g, '' ).toLowerCase().split( ' ' )
	let latest = list
	let err: string
	let pathString = 'main'

	if ( argsArray[ 0 ] !== '' )
	{
		for ( const key of argsArray )
		{
			const command = latest.getCommandWrapper( key )
			if ( !command )
			{
				err = `Cannot find command \`${ key }\` in \`${ pathString }\``
				break
			}

			if ( !( command instanceof Module ) )
			{
				err = `\`${ key }\` has no sub modules`
				break
			}

			latest = command.subCommands
			pathString += ` / ${ key }`
		}
	}

	const summaryString = codeWrap( latest.toSummary() )
	return [
		err,
		`Supported commands in \`${ pathString }\`:\n\n${ summaryString }`
	]
}

/** Response when no arguments are given */
async function missingArguments( req: Request )
{
	return req.embed()
		.setTitle( 'This command requires additional arguments' )
		.send()
}
