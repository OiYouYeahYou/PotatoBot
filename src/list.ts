import List from './classes/List'
import { readdirSync } from 'fs';
import { join } from 'path';

const list = new List
export default list
requireInFile( 'commands' )

export function requireInFile( dir: string, ignoreIndex: boolean = true )
{
	const normalizedPath = join( __dirname, dir )
	const files = readdirSync( normalizedPath )
	const ext = '.js'
	const index = 'index.js'

	for ( const f of files )
		if ( f.endsWith( ext ) && !( ignoreIndex && f.endsWith( index ) ) )
			require( join( normalizedPath, f ) ).default( list )
}
