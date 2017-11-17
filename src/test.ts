console.log( 'This is a test; Do not adjust your set.\n\n' );

// tslint:disable-next-line:no-var-requires
require( './env' );
import { client } from './bot';
import { andSummonerLeague } from './kindred';

setTimeout( () => { client.destroy(); }, 10000 );
andSummonerLeague(
	'nallaj',
	'euw',
	err => {
		if ( err ) {
			console.error(
				'Kindred encountered an error,\n'
				+ 'It might be because Rito has expired the key, again!'
			);

			throw new Error( err );
		}
		else {
			console.log( 'Kindred, ok' );

		}
	}
);
