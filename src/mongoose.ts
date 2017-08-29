import * as keys from './keys';
import * as u from './util';

var mongoose = require('mongoose');
	mongoose.connect( process.env.mlab );

var db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log( 'DB connection');
	});

var userSchema = mongoose.Schema({
		idDiscord: String,
		idLoL: [ Number ],

		updateLast: { type: Date, default: Date.now },
	});

var summonerSchema = mongoose.Schema({
		"id": Number,
		"accountId": Number,
		"name": String,
		"profileIconId": Number,
		"revisionDate": Number,
		"summonerLevel": Number,
		"region": String,

		updateLast: { type: Date, default: Date.now },
	});

var summonerSchema = mongoose.Schema({
		"leagueName": String,
		"tier": String,
		"queueType": String,
		"rank": String,
		"playerOrTeamId": String,
		"playerOrTeamName": String,
		"leaguePoints": Number,
		"wins": Number,
		"losses": Number,
		"veteran": Boolean,
		"inactive": Boolean,
		"freshBlood": Boolean,
		"hotStreak": Boolean,

		updateLast: { type: Date, default: Date.now },
	});

var User = mongoose.model('User', userSchema);

module.exports = {mongoose};

// {
// 	"id": 22829098,
// 	"accountId": 26837115,
// 	"name": "panda bella",
// 	"profileIconId": 2095,
// 	"revisionDate": 1502896266000,
// 	"summonerLevel": 30,
// 	"region": "euw",
// 	"leagues": [
// 		{
// 			"leagueName": "Annie's Villains",
// 			"tier": "GOLD",
// 			"queueType": "RANKED_SOLO_5x5",
// 			"rank": "V",
// 			"playerOrTeamId": "22829098",
// 			"playerOrTeamName": "panda bella",
// 			"leaguePoints": 53,
// 			"wins": 163,
// 			"losses": 176,
// 			"veteran": true,
// 			"inactive": false,
// 			"freshBlood": false,
// 			"hotStreak": true
// 		},
// 		{
// 			"leagueName": "Singed's Reapers",
// 			"tier": "SILVER",
// 			"queueType": "RANKED_FLEX_SR",
// 			"rank": "II",
// 			"playerOrTeamId": "22829098",
// 			"playerOrTeamName": "panda bella",
// 			"leaguePoints": 10,
// 			"wins": 51,
// 			"losses": 47,
// 			"veteran": false,
// 			"inactive": false,
// 			"freshBlood": false,
// 			"hotStreak": false
// 		}
// 	]
// }
