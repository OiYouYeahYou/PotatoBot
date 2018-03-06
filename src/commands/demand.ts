import { PermissionResolvable, VoiceChannel } from 'discord.js'
import { findVoiceChannel, randomString, splitByFirstSpace, TEN } from '../util'
import List from '../classes/List';
import Request from '../classes/Request';

export default function ( list: List )
{
	list.addCommand( 'demand', {
		func: demandRoom,
		help: 'Creates a \'Room of Requirement\'',
		usage: '[limit] [name]',
	} )
}

const REQUIRED_PERMISSONS: PermissionResolvable[] = [
	'MANAGE_CHANNELS', 'MOVE_MEMBERS'
]
const DEFAULT_NAME = 'Room of requirement'
const DEFAULT_ARGS: [ number, string ] = [ undefined, 'Room of requirement' ]
const position = 200

async function demandRoom( req: Request, args: string )
{
	if ( !req.member.voiceChannel )
		return req.destructingReply( 'You need to be in a Voice Channel' )

	if ( !req.guild.me.hasPermission( REQUIRED_PERMISSONS ) )
		return req.destructingReply( 'The bot needs more permissons' )

	var tempName = randomString( 15 )

	await req.guild.createChannel( tempName, 'voice' )
	return newChannelHandler( req, tempName, args )
}

/**
 *
 * @param req Message event
 * @param tmpName Temporary name used to create and find channel
 * @param userLimit User limit to be set to
 * @param name Name for channel to be set too
 */
async function newChannelHandler(
	req: Request,
	tmpName: string,
	args: string
)
{
	const { guild, member } = req
	const channel: VoiceChannel = findVoiceChannel( guild, tmpName )

	if ( !channel )
	{
		await req.delete()

		return req.destructingReply( 'Channel can not be found, try again' )
	}

	const [ userLimit, name ] = processArgs( args )
	const afkChannel = guild.afkChannel
	const parentChannel = afkChannel ? guild.afkChannel.parent : undefined
	const parent = parentChannel ? parentChannel.id : undefined
	const reason = 'Setting up Temporary Channel'
	const config = { name, userLimit, parent, position }

	try
	{
		await channel.edit( config, reason )
		await member.setVoiceChannel( channel.id )
		initIntervalChecker( req, channel )
		await req.destructingReply( 'Done' )
	} catch ( error )
	{
		await channel.delete()
		await req.somethingWentWrong( error )
	}

	return Promise.resolve()
}

/**
 * Processes arguments into an array of required variables
 * @param args
 */
function processArgs( args: string ): [ number, string ]
{
	if ( !args )
		return DEFAULT_ARGS

	var [ limitString, name ] = splitByFirstSpace( args )
	var limit = Number( limitString )

	if ( Number.isNaN( limit ) )
	{
		limit = undefined
		name = args
	}

	if ( !name || name.length < 4 )
		name = DEFAULT_NAME

	return [ limit, name ]
}

/**
 * Cretaes an interval that deletes the channel if the owner is not present
 * @param req
 * @param channel
 */
function initIntervalChecker( req: Request, channel: VoiceChannel ): void
{
	const interval = req.client.setInterval( async () =>
	{
		if ( req.member.voiceChannelID === channel.id )
			return

		req.client.clearInterval( interval )

		await req.delete()

		try
		{
			await channel.delete()
			await req.destructingReply( 'Channel is deleted' )
		} catch ( error )
		{
			await req.destructingReply( 'Channel can\'t be deleted' )
		}
	}, TEN )
}
