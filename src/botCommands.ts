import { Message, RichEmbed } from 'discord.js';
import { bind } from './bind'; // External botCommand
import { TBotRes } from './types';

export var botFuncs = {
	avatar, bind, fancy, help, ping, sendhelp, tantrum, wait,
};

//  //  //  //  //  Command Functions

function ping( message, args ): TBotRes {
	message.reply( 'pong' );
	return;
}

function sendhelp( message, args ): TBotRes {
	return true;
}

function avatar( message, args ): TBotRes {
	message.reply( message.author.avatarURL );
	return;
}

function wait( message, args ): TBotRes {
	message.channel.startTyping( 1 );
	message.client.setTimeout(
		_ => {
			message.reply( 'I have waited' );
			message.channel.stopTyping( true );
		},
		2000
	);
}

function fancy( message, args ): TBotRes {
	message.channel.send( { embed: richEmbed() } );
	return;
}

export function help( message: Message, command: string, result ): TBotRes {
	console.log( 'here' );
	var func = getFunc( command ),
		embed = richEmbed();

	if ( !func ) {
		// TODO: Not a recognised command
		embed
			.setTitle( `Help : ${ command } is not recognised` )
			.setDescription( 'Try using ;list to find your command' );
	}
	else {
		embed
			.setTitle( `Help : ${ command }` )
			.addField( 'Usage', func.usage )
			.addField( 'Purpose', func.help );
	}

	if ( typeof result === 'string' )
		embed.addField( 'What went wrong', result );

	message.channel.send( { embed } );
	return;
}

function tantrum(): TBotRes {
	throw 'BooHoo : tantrum was called';
}
// namespace tantrum {
// 	export var help = 'Throws an intentional tantrum';
// 	export var usage = 'Throws an intentional tantrum';
// }

//  //  //  //  //  Help Text

// bind.help = 'this is not helpful';
// bind.usage = ';bind <region> <username>';
// sendhelp.help = 'there is no help';

//  //  //  //  //  Utilities

export function verifyBotCommands( throwMe?: boolean ) {
	var throwYes;

	Object.keys( botFuncs ).forEach( key => {
		var pass = true,
			thisFunc = botFuncs[ key ];

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

export function getFunc( cmd: string ) {
	if ( cmd in botFuncs && typeof botFuncs[ cmd ] === 'function' )
		return botFuncs[ cmd ];
	else return false;
}

function richEmbed(
	message?: Message,
	cb?: ( message: Message, embed: RichEmbed ) => void
) {
	var embed = new RichEmbed()
		.setAuthor( 'Potato Bot' )
		.setColor( 0x00AE86 )
		.setFooter( 'Yours truly, your friendly neighbourhood bot' );

	if ( typeof cb === 'function' ) {
		cb( message, embed );
		message.channel.send( { embed } );
	}
	else return embed;
}

//  //  //  //  //  Initialiser

Object.keys( botFuncs ).forEach( ( key: string ) => {
	// Purpose:
	//		To propagate aliases
	//		Attach key / func name to self
	//		Bind func to self so that func can use this

	var origin = botFuncs[ key ];
	origin.key = key;

	var func = botFuncs[ key ] = origin.bind( origin );

	Object.assign( func, origin );

	if ( Array.isArray( origin.aliases ) && origin.aliases.length > 0 )
		origin.aliases.forEach( alias => botFuncs[ alias ] = func );
} );
