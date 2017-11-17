import { andSummonerLeague } from './kindred';

andSummonerLeague( 'nallaj', 'euw', qikcb );
andSummonerLeague( 'DaahRealLeon', 'euw', qikcb );
andSummonerLeague( 'ØniHime', 'euw', qikcb );
andSummonerLeague( 'Socksinbox', 'euw', qikcb );
andSummonerLeague( 'O3i', 'euw', qikcb );
andSummonerLeague( 'panda bella', 'euw', qikcb );
andSummonerLeague( 'TT AstroSora', 'euw', qikcb );
andSummonerLeague( 'TT  AstroSora'.toLowerCase(), 'euw', qikcb );
andSummonerLeague( 'TT   AstroSora'.toUpperCase(), 'euw', qikcb );
andSummonerLeague( 'TT    AstroSora', 'euw', qikcb );

function qikcb( err, summoner, leagues ) {
	console.log( summoner );
	console.log( err );
	console.log( leagues );
}
