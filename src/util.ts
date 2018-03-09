import { Guild, Message, VoiceChannel, Snowflake } from 'discord.js'

export const TEN = 10 * 1000

/** String indexOf that returns undefined instead of -1 */
export function indexOf(
	str: string, search: string, position?: number
): number | undefined
{
	var index: number = str.indexOf( search, position )
	return index > 0 ? index : undefined
}

/**
 * Splits string into an array containg first word and remaining string
 * @param text
 */
export function splitByFirstSpace( text: string ): [ string, string ]
{
	text = text.trim()

	if ( !text )
		return [ '', '' ]

	var indexOfFirstSpace = indexOf( text, ' ' )

	var a = text.slice( 0, indexOfFirstSpace ).trim()
	var b = indexOfFirstSpace
		? text.slice( indexOfFirstSpace ).trim()
		: ''

	return [ a, b ]
}

/**
 * Creates a random string of charecters
 * @param len The length of string to return
 *
 * Attribution: thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
 */
export function randomString( len: number )
{
	var t = '', pl = possible.length

	for ( var i = 0; i < len; i++ )
		t += possible.charAt( Math.floor( Math.random() * pl ) )

	return t
}
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Finds a Voice Channel in a guild by name
 * @param guild
 * @param name
 */
export function findVoiceChannel( guild: Guild, name: string ): VoiceChannel
{
	var channel = guild.channels.find( 'name', name )

	if ( channel && channel instanceof VoiceChannel )
		return channel
}

/**
 * Sends a reply that self destructs
 * @param message
 * @param text
 */
export async function destructingReply( message: Message, text: string )
{
	const msg = await message.reply( text )

	await timer( TEN )

	try
	{
		if ( msg instanceof Message )
			await msg.delete()
		else
			for ( const msgItem of msg )
				await msgItem.delete()
	} catch ( error )
	{
		console.error( error )
	}
}

/**
 * Replies to a user that something went wrong, with a reference that can be referenced to server logs
 * @param message
 * @param err
 */
export async function somethingWentWrong( message: Message, err: any )
{
	const id = randomString( 6 )

	if ( err instanceof Error )
		err.message += ` (Event: ${ id })`

	console.log( err )
	return message.reply( `Something went wrong (Event: ${ id })` )
}

export function guildIDNormaliser( guild: Guild | Snowflake ): number
{
	return Number( guild instanceof Guild ? guild.id : guild )
}

export async function timer( time: number )
{
	return new Promise( ( resolve, reject ) =>
		setTimeout( () => resolve(), time )
	)
}

/**
 * Splits command string form rest  of text and lowercases the command
 * @param text
 */
export function processCommandString( text: string ): [ string, string ]
{
	let [ command, args ] = splitByFirstSpace( text )

	command = command.toLowerCase()

	return [ command, args ]
}

export function codeWrap( text: string, lang?: string )
{
	return `\`\`\`${ lang ? lang : '' }\n${ text ? text : '...' }\n\`\`\``
}

export function padRight( text: string | number, len: number )
{
	let res = text
		? text.toString()
		: ''
	while ( res.length < len )
		res += ' '

	return res
}

export function padLeft( text: string | number, len: number )
{
	let res = text
		? text.toString()
		: ''
	while ( res.length < len )
		res = ' ' + res

	return res
}

export function maxStringLength( arr: string[] )
{
	return arr.reduce( ( acc, str ) => str.length > acc ? str.length : acc, 0 )
}

export const noop = () => { }

export async function safeCallAsync<T>( fn: ( ...args ) => Promise<T>, ...args )
	: Promise<[ any, T ]>
{
	let val, err
	try
	{
		val = await fn( ...args )
	}
	catch ( error )
	{
		err = error
	}
	return [ err, val ]
}

export function splitFirstWordAsNumber( args: string, def = 0 )
	: [ number, string ]
{
	if ( !args )
		return [ def, '' ]

	const [ a, b ] = splitByFirstSpace( args )
	const x = Number( a )

	if ( Number.isNaN( x ) )
		return [ def, b ]

	return [ x, b ]
}
