var keys = [
    'discord',
    'ritoplz',
    'mlab',
];
var env = process.env;

( function envTester( env ) {
    var dotenv, res;

    if ( !keys.every( test ) ) {
        dotenv = require( 'dotenv' );
        res = dotenv.config();
    }

    if ( !keys.every( test ) )
        throw new Error( 'env\'s seems not to be set' );

    return res;

    function test( key ) {
        return key in env;
    }
} )( process.env );
