var keys = [
	'discord',
	'ritoplz',
	'mlab',
];

( function envTester( env ) {
	var dotenv, res;
	var test = () => !keys.every( key => key in env );

	if ( test() ) {
		dotenv = require( 'dotenv' );
		res = dotenv.config();
	}

	if ( test() )
		throw new Error( 'env\'s seems not to be set' );

	return res;
} )( process.env );
