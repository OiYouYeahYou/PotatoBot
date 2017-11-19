export { kindred } from 'kindred-api';
import { Kindred, REGIONS } from 'kindred-api';
import { callCB, NOGO, setEnv } from '../util';

setEnv();

// export var kindred = kindred; // FIXME:

export var k = new Kindred( {
	key: process.env.ritoplz,
} );

export var regions = Object.keys( REGIONS ).reduce(
	( obj, key ) => {
		obj[ REGIONS[ key ] ] = key;
		return obj;
	},
	{}
);
export var regionsArray = Object.keys( regions );
export var regionsString = regionsArray.join( ', ' );

export function andSummonerLeague( name, region, cb ) {
	var nogo = new NOGO();

	nogo.tester( typeof name === 'string', 'name parameter is not string' );
	nogo.tester( typeof region === 'string', 'region parameter is not string' );
	nogo.tester( region in regions, 'region parameter is not valid' );
	nogo.tester( cb && typeof cb === 'function', 'callback is not a function' );

	if ( nogo.values ) return callCB( cb )( nogo.values, name );

	k.Summoner.by.name(
		name, region,
		getleague.bind( null, name, region, cb )
	);
}

export function getleague( name, region, cb, err1, summoner ) {
	if ( err1 ) {
		console.error( `Error: ${ name }` );
		console.error( err1 );

		callCB( cb )( err1, summoner );
		return;
	}

	summoner.region = region;

	k.League.positions(
		summoner,
		( err2, leagues ) => {
			callCB( cb )( err2, summoner, leagues );
		}
	);
}
