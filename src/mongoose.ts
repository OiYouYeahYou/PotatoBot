export import mongoose = require( 'mongoose' );

mongoose.connect( process.env.mlab );

var db = mongoose.connection;
	db.on( 'error', console.error.bind( console, 'connection error:' ) );
	db.once( 'open', () => console.log( 'DB connection' ) );

var userSchema = mongoose.Schema( {
	idDiscord: String,
	idLoL: [ Number ],

	updateLast: { type: Date, default: Date.now },
} );

var summonerSchema = mongoose.Schema( {
	id: Number,
	accountId: Number,
	name: String,
	profileIconId: Number,
	revisionDate: Number,
	summonerLevel: Number,
	region: String,

	updateLast: { type: Date, default: Date.now },
} );

var summonerSchema = mongoose.Schema( {
	leagueName: String,
	tier: String,
	queueType: String,
	rank: String,
	playerOrTeamId: String,
	playerOrTeamName: String,
	leaguePoints: Number,
	wins: Number,
	losses: Number,
	veteran: Boolean,
	inactive: Boolean,
	freshBlood: Boolean,
	hotStreak: Boolean,

	updateLast: { type: Date, default: Date.now },
} );

var User = mongoose.model( 'User', userSchema );
