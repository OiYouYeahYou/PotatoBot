import List from "../classes/List"
import Request from "../classes/Request"
import { StreamDispatcher, Message } from "discord.js";
import { codeWrap } from "../util";
const yt = require( 'ytdl-core' )

const prefix = ':'
const passes = 1

interface IQueue
{
	[ key: string ]: {
		song?: string
		playing?: boolean
		songs?: {
			url: string
			title: string
			requester: string
		}[]
	}
}

let queue: IQueue = {}
export const music = new List
music.addCommand( 'play', { func: Func_play, help: '', } )
music.addCommand( 'join', { func: Func_join, help: '', } )
music.addCommand( 'add', { func: Func_add, help: '', } )
music.addCommand( 'queue', { func: Func_queue, help: '', } )

async function Func_play( req: Request )
{
	const { id } = req.guild
	if ( queue[ id ] === undefined )
		return req.send(
			`Add some songs to the queue first with ${ prefix }add`
		)

	if ( !req.guild.voiceConnection )
	{
		await Func_join( req )
		await Func_play( req )
		return
	}

	if ( queue[ id ].playing )
		return req.send( 'Already Playing' )

	let dispatcher: StreamDispatcher
	queue[ id ].playing = true

	console.log( queue );
	( async function play( song )
	{
		const { title, requester, url } = song
		console.log( song )
		if ( song === undefined )
		{
			queue[ id ].playing = false
			req.member.voiceChannel.leave()

			return req.send( 'Queue is empty' )
		}

		req.send(
			`Playing: **${ title }** as requested by: **${ requester }**`
		)

		dispatcher = req.guild.voiceConnection.playStream(
			yt( url, { audioonly: true } ),
			{ passes }
		)

		const collector = req.channel.createCollector( m => m )
		// @ts-ignore
		collector.on( 'message', async ( m: Message ) =>
		{
			const { content } = m
			const currentVolume = Math.round( dispatcher.volume * 50 )

			if ( isCommand( content, 'pause' ) )
				return disp.pause( dispatcher, req )
			else if ( isCommand( content, 'resume' ) )
				return disp.resume( dispatcher, req )
			else if ( isCommand( content, 'skip' ) )
				return disp.end( dispatcher, req )
			else if ( m.content.startsWith( 'volume+' ) )
			{
				if ( !( currentVolume >= 100 ) )
					dispatcher.setVolume( Math.min( ( dispatcher.volume * 50 + ( 2 * ( m.content.split( '+' ).length - 1 ) ) ) / 50, 2 ) )

				return disp.currentVol( dispatcher, req )
			}
			else if ( m.content.startsWith( 'volume-' ) )
			{
				if ( !( currentVolume <= 0 ) )
					dispatcher.setVolume( Math.max( ( dispatcher.volume * 50 - ( 2 * ( m.content.split( '-' ).length - 1 ) ) ) / 50, 0 ) )

				return disp.currentVol( dispatcher, req )
			}
			else if ( isCommand( content, 'time' ) )
				return disp.time( dispatcher, req )
		} )
		dispatcher.on( 'end', async () =>
		{
			collector.stop()
			return play( queue[ id ].songs.shift() )
		} )
		dispatcher.on( 'error', async ( err ) =>
		{
			await req.send( 'error: ' + err )
			collector.stop()
			await play( queue[ id ].songs.shift() )
		} )
	} )( queue[ id ].songs.shift() )
}

async function Func_join( req: Request )
{
	const { voiceChannel } = req.member
	if ( !voiceChannel || voiceChannel.type !== 'voice' )
		return req.reply( 'I couldn\'t connect to your voice channel...' )

	return voiceChannel.join()
}

function Func_add( req: Request )
{
	let url = req.message.content.split( ' ' )[ 1 ]
	if ( url == '' || url === undefined )
		return req.send( `You must add a YouTube video url, or id after ${ prefix }add` )

	yt.getInfo( url, ( err, info ) =>
	{
		const { id } = req.guild

		if ( err )
			return req.send( 'Invalid YouTube Link: ' + err )

		if ( !queue.hasOwnProperty( id ) )
			queue[ id ] = {
				playing: false,
				songs: []
			}

		queue[ id ].songs.push(
			{
				url,
				title: info.title,
				requester: req.author.username
			}
		)

		req.send( `added **${ info.title }** to the queue` )
	} )
}

async function Func_queue( req: Request )
{
	const { id, name } = req.guild

	if ( queue[ id ] === undefined )
		return req.send(
			`Add some songs to the queue first with ${ prefix }add`
		)

	const tosend = []
	queue[ id ].songs.forEach(
		( { title, requester }, i ) => tosend.push(
			`${ i + 1 }. ${ title } - Requested by: ${ requester }`
		)
	)
	const { length } = tosend
	const queueString = length > 15 ? '*[Only next 15 shown]*' : ''
	const x = codeWrap( tosend.slice( 0, 15 ).join( '\n' ) )

	await req.send(
		`__**${ name }'s Music Queue:**__ Currently **${ length }** songs queued ${ queueString }\n${ x }`
	)
}


////////////

function isCommand( str: string, name: string )
{
	return str.startsWith( prefix + name )
}

interface IDisp
{
	[ key: string ]: ( dispatcher: StreamDispatcher, req: Request ) => Promise<any>
}

const disp: IDisp = {
	pause: async ( dispatcher: StreamDispatcher, req: Request ) =>
	{
		dispatcher.pause()
		return req.send( 'paused' )
	},
	resume: async ( dispatcher: StreamDispatcher, req: Request ) =>
	{
		dispatcher.resume()
		return req.send( 'resumed' )
	},
	end: async ( dispatcher: StreamDispatcher, req: Request ) =>
	{
		dispatcher.end()
		return req.send( 'skipped' )
	},
	currentVol: async ( dispatcher: StreamDispatcher, req: Request ) =>
		req.send( `Volume: ${ Math.round( dispatcher.volume * 50 ) }%` ),
	time: async ( dispatcher: StreamDispatcher, req: Request ) =>
	{
		const x = ( dispatcher.time % 60000 ) / 1000

		const minutes = Math.floor( dispatcher.time / 60000 )
		const seconds = Math.floor( x ) < 10
			? '0' + Math.floor( x )
			: Math.floor( x )

		return req.send( `time: ${ minutes }:${ seconds }` )
	},
}
