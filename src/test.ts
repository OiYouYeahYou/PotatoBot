console.log( 'This is a test; Do not adjust your set.\n\n' );

import { client } from './client/client';
import { setEnv } from './util';

setEnv();

setTimeout( () => { client.destroy(); }, 10000 );
