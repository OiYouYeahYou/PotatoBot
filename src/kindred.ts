require( './env' );
import * as kindred from 'kindred-api';
import * as keys from './keys';
import * as u from './util';

// export var kindred = kindred; // FIXME:

// console.log( env );
// console.log( process.env );
// env.dontShakeMe()

export var k = new kindred.Kindred( {
	key: process.env.ritoplz,
} );

export var regions = Object.keys( kindred.REGIONS ).reduce(
		( obj, key ) => {
			obj[ kindred.REGIONS[ key ] ] = key;
			return obj;
		},
		{}
	),
	regionsArray = Object.keys( regions ),
	regionsString = regionsArray.join( ', ' );

module.exports = {
	kindred, k, andSummonerLeague, regions, regionsArray, regionsString,
};

export function andSummonerLeague( name, region, cb ) {
	var nogo = new u.NOGO();

	nogo.tester( typeof name === 'string', 'name parameter is not string' );
	nogo.tester( typeof region === 'string', 'region parameter is not string' );
	nogo.tester( region in regions, 'region parameter is not valid' );
	nogo.tester( cb && typeof cb === 'function', 'callback is not a function' );

	if ( nogo.values ) return u.callCB( cb )( nogo.values, name );

	k.Summoner.by.name(
		name, region,
		getleague.bind( null, name, region, cb )
	);
}

export function getleague( name, region, cb, err, summoner ) {
	if ( err ) {
		console.error( `Error: ${ name }` );
		console.error( err );

		u.callCB( cb )( err, summoner );
		return;
	}

	summoner.region = region;

	k.League.positions(
		summoner,
		( err, leagues ) => {
			u.callCB( cb )( err, summoner, leagues );
		}
	);
}
