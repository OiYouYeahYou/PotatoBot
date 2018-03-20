import List from '../classes/List'
import Request from '../classes/Request'
import { StreamDispatcher, Guild } from 'discord.js'
import { codeWrap } from '../util'
import yt = require( 'ytdl-core' )
import { splitByFirstSpace } from '../../lib/util'
import help from '../commands/help'

const ytdOptions: yt.downloadOptions = { filter: 'audioonly' }
const streamOptions = { passes: 1 }

async function Func_play( req: Request, args?: string )
{
	if ( args )
		await Func_add( req, args )

	if ( !req.voiceConnection )
	{
		await Func_join( req )
		await Func_play( req )
		return
	}

	const state = store._get( req )

	if ( state.playing )
		return req.send( 'Already Playing' )

	state.playing = true

	await play( state.shift(), req )
}

async function Func_join( req: Request )
{
	const { voiceChannel } = req.member

	if ( !voiceChannel )
		return req.reply( 'You need to be connected to a voice channel' )

	try
	{
		await voiceChannel.join()
	}
	catch ( error )
	{
		req.reply( 'Cannot connect to that channel' )
	}
}

async function Func_add( req: Request, url: string )
{
	if ( !url )
		return req.send( `Usage is: \`${ req.prefix }add <video url>\`` )

	try
	{
		var info = await yt.getInfo( url )
	}
	catch ( err )
	{
		return req.somethingWentWrong( err )
	}

	store.add( url, info, req )
	req.send( `added **${ info.title }** to the queue` )
}

async function Func_queue( req: Request )
{
	const { name } = req.guild
	const state = store._get( req )

	const tosend: string[] = []
	const { songs } = state
	const { length } = songs
	const amountToShow = Math.min( 15, length )

	for ( var i = 1; i < amountToShow + 1; i++ )
	{
		const { title, requester } = songs[ i ]

		tosend.push( `${ i }. ${ title } - Requested by: ${ requester }` )
	}

	const queueString = length > 15 ? '*[Only next 15 shown]*' : ''
	const x = codeWrap( tosend.join( '\n' ) )
	const respone = `__**${ name }'s Music Queue:**__ Currently **${ length }** songs queued ${ queueString }\n${ x }`

	await req.send( respone )
}

const Func_pause = ( req ) => standardDispaterCall( req, 'paused', 'pause' )
const Func_resume = ( req ) => standardDispaterCall( req, 'resumed', 'resume' )
const Func_skip = ( req ) => standardDispaterCall( req, 'skipped', 'end' )

async function Func_volume( req, args )
{
	const state = store.get( req )
	if ( !state )
		return req.send( 'Player has not been started' )

	const [ x ] = splitByFirstSpace( args )
	const vol = Number( x )
	const oldVol = state.getVol()

	if ( vol && !Number.isNaN( vol ) )
	{
		const newVol = Math.round( vol )

		if ( newVol < 0 || newVol > 100 )
			return req.reply( 'Please use a number from 0 - 100' )

		state.setVolume( newVol )

		return req.send( `Volume: ${ newVol }% from ${ oldVol }%` )
	}

	return req.send( `Volume: ${ oldVol }%` )
}

async function Func_now( req: Request )
{
	const state = store._get( req )
	const { current } = state

	return nowPlaying( req, current )
}

////////////

function createDispatcher( { url }: Song, req: Request )
{
	const { voiceConnection } = req
	const dispatcher = voiceConnection.playStream(
		yt( url, ytdOptions ),
		streamOptions
	)

	dispatcher.on( 'end', async () => play( store.shift( req ), req ) )
	dispatcher.on( 'error',
		async ( err ) =>
		{
			await req.send( 'error: ' + err )
			await play( store.shift( req ), req )
		}
	)

	return dispatcher
}

async function nowPlaying( req: Request, song: Song )
{
	return req.send(
		`Playing: **${ song.title }** requester: **${ song.requester }**`
	)
}

async function play( song: Song, req: Request )
{
	if ( !song )
		return leave( req, 'Queue is empty' )

	await nowPlaying( req, song )
	store._get( req ).updateDispatcher( song, req )
}

async function leave( req: Request, msg?: string )
{
	store._get( req ).playing = false
	req.member.voiceChannel.leave()

	if ( msg )
		return req.send( msg )
}

type dispatcherMethods = 'pause' | 'resume' | 'end'
async function standardDispaterCall(
	req: Request,
	success: string,
	prop: dispatcherMethods
)
{
	const state = store.get( req )
	if ( !state )
		return req.send( 'Player has not been started' )

	state[ prop ]()
	return req.send( success )
}

type ResolvableGuildID = string | Guild | Request
function resolveToGuildID( resolvable: ResolvableGuildID )
{
	if ( typeof resolvable === 'string' )
		return resolvable
	else if ( resolvable instanceof Guild )
		return resolvable.id
	else if ( resolvable instanceof Request )
		return resolvable.guild.id
}

//////////

class Store
{
	states: { [ key: string ]: GuildPlayerState } = {}

	get( resolvable: ResolvableGuildID ): GuildPlayerState | false
	{
		const id = resolveToGuildID( resolvable )
		return this.states[ id ]
	}

	_get( resolvable: ResolvableGuildID )
	{
		const id = resolveToGuildID( resolvable )
		if ( !this.states[ id ] )
			this.states[ id ] = new GuildPlayerState

		return this.states[ id ]
	}

	add( url: string, info: yt.videoInfo, req: Request )
	{
		return this._get( req ).add( url, info, req )
	}

	shift( resolvable: ResolvableGuildID )
	{
		return this._get( resolvable ).shift()
	}
}

class GuildPlayerState
{
	constructor()
	{

	}

	songs: Song[] = []
	current: Song
	playing: boolean = false

	// state: 'PLAYING' | 'PAUSED' | 'EMPTY' | 'AUTOPLAYING'
	private dispatcher: StreamDispatcher

	add( url: string, info: yt.videoInfo, req: Request )
	{
		const song = new Song( url, info, req )
		this.songs.push( song )
	}

	shift()
	{
		return this.current = this.songs.shift()
	}

	pause()
	{
		this.dispatcher.pause()
	}
	resume()
	{
		this.dispatcher.resume()
	}
	end()
	{
		this.dispatcher.end()
	}

	updateDispatcher( song, req )
	{
		return this.dispatcher = createDispatcher( song, req )
	}

	getVol()
	{
		return Math.round( this.dispatcher.volume * 50 )
	}

	setVolume( vol: number )
	{
		this.dispatcher.setVolume( vol )
	}
}

class Song
{
	constructor( url: string, info: yt.videoInfo, req: Request )
	{
		this.url = url
		this.title = info.title
		this.requester = req.screenname
	}

	url: string
	title: string
	requester: string
}

////////////

const store = new Store()

export const music = new List
help( music )
music.addCommand( 'play', {
	func: Func_play,
	help: 'Plays, adds, joins or resumes the player',
	usage: '[youtube link]',
} )
music.addCommand( 'join', {
	func: Func_join,
	help: 'Brings the bot to the voice channel',
	aliases: [ 'summon' ],
} )
music.addCommand( 'add', {
	func: Func_add,
	help: 'Adds tracks to the playlist',
	usage: '[youtube link]',
} )
music.addCommand( 'queue', {
	func: Func_queue,
	help: 'Displays the playlist',
	aliases: [ 'q' ],
} )
music.addCommand( 'pause', {
	func: Func_pause,
	help: 'Pauses the player',
} )
music.addCommand( 'resume', {
	func: Func_resume,
	help: 'Resumes the player',
} )
music.addCommand( 'skip', {
	func: Func_skip,
	help: 'Goes to the next song',
	aliases: [ 'next' ],
} )
music.addCommand( 'volume', {
	func: Func_volume,
	help: 'Manages bot volume',
	aliases: [ 'vol' ],
	usage: '[new volume]',
} )
music.addCommand( 'now', {
	func: Func_now,
	help: 'What is the current song',
	aliases: [ 'np' ],
} )
