import { Message } from "discord.js";
import { list } from "../commands";
import { richEmbed } from "../discord/embed";
import Command from "../classes/Command";

list.addCommand( 'help', {
	func: helpFunction,
	help: 'Provides information about a command',
	usage: '<command>',
} );

export async function helpFunction( message: Message, text: string ) {
	const commands = text.replace( / +(?= )/g, '' ).toLowerCase().split( ' ' );

	if ( !commands.length )
		return missingArguments( message );
	else if ( commands.length > 5 )
		return message.reply( 'You have requested to many arguments' )

	for ( const command of commands ) {
		if ( !command )
			continue;

		const wrapper = list.getCommandWrapper( command );

		const embed = wrapper
			? helpEmebd( command, wrapper )
			: missingWrapper( command );

		await message.channel.send( { embed } );
	}
}

list.addCommand( 'list', {
	func: async ( message: Message ) => {
		const commandList = Object.keys( list.list ).sort().join( '\n' );

		return message.channel.send( commandList );
	},
	help: 'Provides a list of commands',
} );

/** Response when no arguments are given */
async function missingArguments( message: Message ) {
	const embed = richEmbed()
		.setTitle( 'This command requires additional arguments' );

	return message.channel.send( embed );
}

/** Response when a wrapper could not be found */
function missingWrapper( command: string ) {
	return richEmbed()
		.setTitle( `Help : ${ command } is not recognised` )
		.setDescription( 'Try using ;list to find your command' );
}

/** Converts a Command into an Embed response */
function helpEmebd( command: string, wrapper: Command ) {
	return richEmbed()
		.setTitle( `Help : ${ command }` )
		.addField( 'Usage', wrapper.usage )
		.addField( 'Purpose', wrapper.help );
}
