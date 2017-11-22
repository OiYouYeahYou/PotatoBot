import { Guild, Message, Role, Snowflake } from 'discord.js';
import { andSummonerLeague, regions } from '../kindred/';
import {
	IBindingResult, IBindingResults, ILeague, ISummoner, TBotRes,
} from '../types';
import { indexOf, nin, quatch } from '../util';

var bindingResults: IBindingResults = {};
var guildCache = {};

var toTierNumber = {
	challenger: 7,
	master: 6,
	diamond: 5,
	platinum: 4,
	gold: 3,
	silver: 2,
	bronze: 1,
};
var toRankNumber = {
	i: 0.8,
	ii: 0.6,
	iii: 0.4,
	iv: 0.2,
	v: 0.0,
};

export const WrapperBind = {
	func: bind,
	disabled: true,
};

function bind( message: Message, args: string ): TBotRes {
	var regionEnd: number | undefined,
		region: string,
		user: string;

	if ( !args )
		return true;

	regionEnd = indexOf( args, ' ' );

	if ( !regionEnd )
		return true;

	region = args.slice( 0, regionEnd ).toLowerCase().trim();

	if ( nin( region, regions ) )
		return 'invalid region';

	user = args.slice( regionEnd ).trim();

	andSummonerLeague(
		user, region,
		handleResult.bind( null, message )
	);
}

function handleResult(
	message: Message,
	err,
	summoner: ISummoner,
	leagues: ILeague[]
) {
	var userId: Snowflake;

	summoner.leagues = leagues;
	userId = message.author.id;

	// message.channel.send( JSON.stringify( summoner, null, 4 ) ); // TODO: Make into better response

	var res: IBindingResult
		= userId in bindingResults
			? bindingResults[ userId ]
			: bindingResults[ userId ] = {};

	res[ summoner.id ] = summoner;

	var highestScore: number = -1,
		highestRank: string = '',
		highestTier: string = 'unranked';

	if ( Array.isArray( leagues ) )
		leagues.forEach( ( element: ILeague ) => {
			var score = attachScore( element );

			if ( score > highestScore ) {
				highestScore = score;
				highestRank = element.rank;
				highestTier = element.tier;
			}
		} );

	highestTier = highestTier.toLowerCase();
	highestRank = highestRank.toLowerCase();

	var cache: any = guildcheck( message.guild );
	var idRoleToApply: any = cache[ highestTier ]; // Set Rank

	Object.keys( cache ).forEach(
		( key: Snowflake ) => quatch(
			() => message.member.removeRole( cache[ key ] )
		)
	);

	quatch( () => message.member.addRole( idRoleToApply ) );

	message.reply( `Role ${ highestTier } applied` );

	// TODO: make function that takes bindingResults and applyies roles
}

function attachScore( obj: ILeague ) {
	// if ( 'sortScore' in obj )
	// 	obj.sortScore;

	var sortScore: number = 0,
		tier: string = obj.tier.toLowerCase(),
		rank: string = obj.rank.toLowerCase();

	if ( tier in toTierNumber && rank in toRankNumber )
		sortScore = toTierNumber[ tier ] + toRankNumber[ rank ];
	// else if ( nin( rank, toRankNumber) )
	// 	console.log( `Rank : ${ rank } does not exist` );

	obj.sortScore = sortScore;

	return sortScore;
}

function guildcheck( guild: Guild, message?: Message ) {
	var idGuild: Snowflake = guild.id,
		cache = idGuild in guildCache
			? guildCache[ idGuild ]
			: guildCacheConstructor( guild, message, idGuild );

	return cache;
}

function guildCacheConstructor(
	guild: Guild, message: Message, idGuild: Snowflake
) {
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
	};

	guild.roles.forEach( ( role: Role ) => {
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
	Object.keys( cache ).forEach( ( role: Snowflake ) =>
		!cache[ role ] &&
		console.error( `${ role } does not exist in ${ guild.id }` )
	);

	return cache;
}
