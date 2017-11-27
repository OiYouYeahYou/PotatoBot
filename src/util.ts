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
export function noop() {}

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
export function isPrefixed( pfx, str ) {
	return (
		typeof pfx === 'string' && pfx.length > 0 &&
		typeof str === 'string' && str.startsWith( pfx )
	);
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
	var lookForKeys = () => ![ 'discord', 'ritoplz', 'mlab', ].every(
		key => key in process.env
	);

	if ( lookForKeys() )
		require( 'dotenv' ).config();

	if ( lookForKeys() )
		throw new Error( 'env\'s seems not to be set' );
}

/**
 * Splits string into
 * @param text
 */
export function splitByFirstSpace(
	text: string
): [ string, string | undefined ] {
	text = text.trim();

	var indexOfFirstSpace = indexOf( text, ' ' );

	var a = text.slice( 0, indexOfFirstSpace ).trim();
	var b = indexOfFirstSpace
		? text.slice( indexOfFirstSpace ).trim()
		: undefined;

	return [ a, b ];
}

/**
 * Removes prefix and splits command from args
 * @param pfx
 * @param text
 */
export function splitCommandString( pfx: string, text: string) {
	text = text.slice( pfx.length ).trim();

	return splitByFirstSpace( text );
}
