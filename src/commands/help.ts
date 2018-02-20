import Request from '../classes/Request';
import { richEmbed } from '../discord/embed'
import { codeWrap } from '../util'
import Module from '../classes/Module'
import AListItem from '../classes/AListItem'
import List from '../classes/List';
import list from '../list';

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
			const [ err, response ] = treeWalker( args )

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

		const wrapper = list.getCommandWrapper( command )

		const embed = wrapper
			? helpEmebd( command, wrapper )
			: missingWrapper( command )

		await req.send( { embed } )
	}
}

function treeWalker( args )
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
	const embed = richEmbed()
		.setTitle( 'This command requires additional arguments' )

	return req.send( embed )
}

/** Response when a wrapper could not be found */
function missingWrapper( command: string )
{
	return richEmbed()
		.setTitle( `Help : ${ command } is not recognised` )
		.setDescription( 'Try using list to find your command' )
}

/** Converts a Command into an Embed response */
function helpEmebd( command: string, wrapper: AListItem )
{
	return richEmbed()
		.setTitle( `Help : ${ command }` )
		.addField( 'Usage', wrapper.usage )
		.addField( 'Purpose', wrapper.help )
}
