export function nin( key, obj ) { return !( key in obj ); }

export function callCB( cb ) {
	if ( typeof cb === 'function' )
		return cb;
	else
		return noop;
}

// tslint:disable-next-line:no-empty
export function noop() {}

export function NOGO() {
	var that = this;

	that.values = undefined;
	that.tester = function tester( condition, msg ) {
		if ( condition ) return true;

		if ( !that.values )
			that.values = new Error( msg );
		else if ( typeof that.values === 'string' )
			that.values = [ that.values, new Error( msg ) ];
		else if ( Array.isArray( that.values ) )
			that.values.push( new Error( msg ) );
	};
}

export function validatePrefix( pfx, str ) {
	return (
		typeof pfx === 'string' && pfx.length > 0 &&
		typeof str === 'string' && str.startsWith( pfx )
	);
}

export function quatch( trie: () => any, fin?: () => void ) {
	try { trie(); }
	catch ( e ) { console.log( e ); }
	finally { callCB( fin )(); }
}

// String indexOf that returns undefined instead of -1
export function indexOf(
	str: string, search: string, position?: number
): number | undefined {
	var index: number = str.indexOf( search, position );
	return index > 0 ? index : undefined;
}

export function setEnv() {
	var env = process.env;
	var keys = [
		'discord',
		'ritoplz',
		'mlab',
	];

	var test = () => !keys.every( key => key in env );

	if ( test() ) {
		var dotenv = require( 'dotenv' );
			dotenv.config();
	}

	if ( test() )
		throw new Error( 'env\'s seems not to be set' );
}
