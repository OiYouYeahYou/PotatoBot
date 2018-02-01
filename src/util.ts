import { Guild, Message, VoiceChannel, Snowflake } from "discord.js";
import { client } from "./discord/client";
import { join } from "path";
import { readdirSync } from "fs";

export const TEN = 10 * 1000;

export function nin( key, obj ) { return !( key in obj ); }

/**
 * Safely calls a function
 * @param cb callback
 */
export function callCB( cb ) {
	if ( typeof cb === 'function' )
		return cb;
	else
		return noop;
}

/** Non operation */
// tslint:disable-next-line:no-empty
export function noop() { }

export function NOGO() {
	var that = this;

	that.values = undefined;
	that.tester = ( condition, msg ) => {
		if ( condition ) return true;

		if ( !that.values )
			that.values = new Error( msg );
		else if ( typeof that.values === 'string' )
			that.values = [ that.values, new Error( msg ) ];
		else if ( Array.isArray( that.values ) )
			that.values.push( new Error( msg ) );
	};
}

/**
 * Tests if string is prefixed
 * @param pfx prefix
 * @param str text
 */
export function isPrefixed( pfx: string, str: string ) {
	return str.length !== pfx.length
		&& pfx.length > 0
		&& str.startsWith( pfx );
}

/**
 *
 * @param trie
 * @param fin
 */
export function quatch( trie: () => any, fin?: () => void ) {
	try { trie(); }
	catch ( e ) { console.log( e ); }
	finally { callCB( fin )(); }
}

/** String indexOf that returns undefined instead of -1 */
export function indexOf(
	str: string, search: string, position?: number
): number | undefined {
	var index: number = str.indexOf( search, position );
	return index > 0 ? index : undefined;
}

/** Checks if env exists, and sets if they don't */
export function setEnv() {
	const keys = [ 'discord', 'ritoplz', 'mongo' ];

	const actionNeeded = !keys.every( key => key in process.env );

	if ( actionNeeded )
		require( 'dotenv' ).config();

	const missingEnv = keys.filter( key => !( key in process.env ) );

	if ( missingEnv.length ) {
		const missingString = missingEnv.join( ', ' );
		throw new Error( `Enviromentals missing: ${ missingString }` );
	}
}

/**
 * Splits string into an array containg first word and remaining string
 * @param text
 */
export function splitByFirstSpace( text: string ): [ string, string ] {
	if ( !text )
		return [ '', '' ];

	text = text.trim();

	var indexOfFirstSpace = indexOf( text, ' ' );

	var a = text.slice( 0, indexOfFirstSpace ).trim();
	var b = indexOfFirstSpace
		? text.slice( indexOfFirstSpace ).trim()
		: '';

	return [ a, b ];
}

/**
 * Removes prefix and splits command from args
 * @param pfx
 * @param text
 */
export function splitCommandString( pfx: string, text: string ) {
	text = text.slice( pfx.length ).trim();

	return splitByFirstSpace( text );
}

/**
 * Creates a random string of charecters
 * @param len The length of string to return
 *
 * Attribution: thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
 */
export function randomString( len: number ) {
	var t = "", pl = possible.length;

	for ( var i = 0; i < len; i++ )
		t += possible.charAt( Math.floor( Math.random() * pl ) );

	return t;
}
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface IDeletable {
	deletable: boolean;
	delete: () => Promise<any>;
}

export async function safeDelete( entity: IDeletable ): Promise<any> {
	if ( entity.deletable )
		return entity.delete();
}

/**
 * Finds a Voice Channel in a guild by name
 * @param guild
 * @param name
 */
export function findVoiceChannel( guild: Guild, name: string ): VoiceChannel {
	var channel = guild.channels.find( 'name', name );

	if ( channel && channel instanceof VoiceChannel )
		return channel;
}

/**
 * Sends a reply that self destructs
 * @param message
 * @param text
 */
export async function destructingReply( message: Message, text: string ) {
	const msg = await message.reply( text )

	await timer( TEN );

	try {
		if ( msg instanceof Message )
			await msg.delete();
		else
			for ( const msgItem of msg )
				await msgItem.delete();
	} catch ( error ) {
		console.error( error )
	}
}

/**
 * Replies to a user that something went wrong, with a reference that can be referenced to server logs
 * @param message
 * @param err
 */
export async function somethingWentWrong( message: Message, err: any ) {
	const id = randomString( 6 );

	if ( err instanceof Error )
		err.message += ` (Event: ${ id })`;

	console.log( err );
	return message.reply( `Something went wrong (Event: ${ id })` );
}

export function guildIDNormaliser( guild: Guild | Snowflake ): number {
	return Number( guild instanceof Guild ? guild.id : guild );
}

export async function timer( time: number ) {
	return new Promise( ( resolve, reject ) =>
		client.setTimeout( () => resolve(), time )
	);
}

export function requireInFile( dir: string, ignoreIndex: boolean = true ) {
	const normalizedPath = join( __dirname, dir );
	const files = readdirSync( normalizedPath )
	const ext = '.js'
	const index = 'index.js'

	for ( const f of files )
		if ( f.endsWith( ext ) && !( ignoreIndex && f.endsWith( index ) ) )
			require( join( normalizedPath, f ) );
}
