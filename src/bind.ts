// tslint:disable
import Discord = require('discord.js');
import kindred = require('./kindred');
import * as types from './types';
import u = require( './util' );

var bindingResults: types.bindingResults = {};
var guildCache = {};

var toTierNumber = {
		"challenger": 7,
		"master": 6,
		"diamond": 5,
		"platinum": 4,
		"gold": 3,
		"silver": 2,
		"bronze": 1,
	},
	toRankNumber = {
		i: 0.8,
		ii: 0.6,
		iii: 0.4,
		iv: 0.2,
		v: 0.0,
	}
;

module.exports = bind;

function bind( message: Discord.Message, args: string ): types.botRes {
	var regionEnd: number | undefined,
		region: string,
		user: string;

	if ( !args )
		return true;

	regionEnd = u.indexOf( args, ' ' );

	if ( !regionEnd )
		return true;

	region = args.slice( 0, regionEnd ).toLowerCase().trim();

	if ( u.nin( region, kindred.regions ) )
		return 'invalid region';

	user = args.slice( regionEnd ).trim();

	kindred.andSummonerLeague(
		user, region,
		handleResult.bind( null, message )
	);
}

function handleResult
	(
		message: Discord.Message,
		err,
		summoner: types.Summoner,
		leagues: Array<types.League>
	) {
		var userId:Discord.Snowflake;

		summoner.leagues = leagues;
		userId = message.author.id;

		// message.channel.send( JSON.stringify( summoner, null, 4 ) ); // TODO: Make into better response

		var res : types.bindingResult
			= userId in bindingResults
			? bindingResults[ userId ]
			: bindingResults[ userId ] = {};

		res[ summoner.id ] = summoner;

		var highestScore: number = -1,
			highestRank: string = '',
			highestTier: string = 'unranked';

		if ( Array.isArray( leagues ) )
			leagues.forEach( ( element: types.League ) => {
				var score = attachScore( element );

				if ( score > highestScore ) {
					highestScore = score;
					highestRank = element.rank;
					highestTier = element.tier;
				}
			} );

		highestTier = highestTier.toLowerCase();
		highestRank = highestRank.toLowerCase();

		var cache:any = guildcheck( message.guild );
		var idRoleToApply:any = cache[ highestTier ]; // Set Rank

		Object.keys( cache ).forEach(
			(key:Discord.Snowflake) => u.quatch(
				_ => message.member.removeRole( cache[ key ] )
			)
		);

		u.quatch( _ => message.member.addRole( idRoleToApply ) );

		message.reply( `Role ${ highestTier } applied` );

		// TODO: make function that takes bindingResults and applyies roles
}

function attachScore( obj: types.League ) {
	if ( 'sortScore' in obj ) obj.sortScore;

	var sortScore: number = 0,
		tier: string = obj.tier.toLowerCase(),
		rank: string = obj.rank.toLowerCase();

	if ( tier in toTierNumber && rank in toRankNumber )
		sortScore = toTierNumber[ tier ] + toRankNumber[ rank ];
	// else if ( u.nin( tier, toTierNumber) )
	// 	console.log( `Tier : ${ tier } does not exist` );
	// else if ( u.nin( rank, toRankNumber) )
	// 	console.log( `Rank : ${ rank } does not exist` );

	obj.sortScore = sortScore;

	return sortScore;
}

function guildcheck( guild: Discord.Guild, message?: Discord.Message ) {
	var idGuild: Discord.Snowflake = guild.id,
		cache = idGuild in guildCache
			? guildCache[ idGuild ]
			: guildCacheConstructor( guild, message, idGuild );

	return cache;
}

function guildCacheConstructor( guild: Discord.Guild, message: Discord.Message, idGuild: Discord.Snowflake ) {
	var cache = guildCache[ idGuild ] = {
		challenger: undefined,
		master: undefined,
		diamond: undefined,
		platinum: undefined,
		gold: undefined,
		silver: undefined,
		bronze: undefined,
		unranked: undefined,
		chello: undefined,
	}

	guild.roles.forEach( ( role: Discord.Role ) => {
		var name: string = role.name.toLowerCase();

		if ( name in cache ) {
			// TODO: do something better with this
			if ( cache[ name ] )
				return message.channel.send(
					`Roles duplication:\n`
					+ `    Guild: ${ guild.id }\n`
					+ `    Role: ${ name }`
				);

			cache[ name ] = role.id;
		}
	} );

	// Validation
	Object.keys( cache ).forEach( ( role: Discord.Snowflake ) =>
		!cache[ role ] &&
			console.error( `${ role } does not exist in ${ guild.id }` )
	);

	return cache;
}
