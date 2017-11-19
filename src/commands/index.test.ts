import { commands } from './';

export function verifyBotCommands( throwMe?: boolean ) {
	var throwYes;

	Object.keys( commands ).forEach( key => {
		var pass = true,
			thisFunc = commands[ key ];

		test( 'Not lowercase', key === key.toLowerCase() );
		test( 'Not function', typeof thisFunc === 'function' );
		test( 'No help string', typeof thisFunc.help === 'string' );
		test( 'No usage string', typeof thisFunc.usage === 'string' );

		if ( pass ) console.log( `Pass for ${ key }` );
		else throwYes = true;

		function test( name, condition ) {
			if ( condition ) return;

			if ( pass ) console.warn( `Warnings for : ${ key }` );

			// console.warn( `${ key } : Not ${ name }`);
			pass = false;
		}
	} );

	if ( throwMe && throwYes ) throw 'Bot Commands seem to be improperly labeled';
}
