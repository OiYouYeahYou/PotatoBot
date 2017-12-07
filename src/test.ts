console.log( 'This is a test; Do not adjust your set.\n\n' );

import { client } from './client/client';
import { andSummonerLeague } from './kindred';
import { setEnv } from './util';

setEnv();

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
