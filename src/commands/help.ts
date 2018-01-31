import { Message } from "discord.js";
import { list } from "../commands";
import { richEmbed } from "../discord/embed";

list.Command( 'help', {
	func: helpFunction,
	help: 'Provides information about a command',
	usage: '<command>',
} );

export async function helpFunction( message: Message, command: string ) {
	const commandWrapper = list.getCommandWrapper( command );
	const embed = richEmbed();

	if ( !commandWrapper ) {
		embed
			.setTitle( `Help : ${ command } is not recognised` )
			.setDescription( 'Try using ;list to find your command' );
	}
	else {
		embed
			.setTitle( `Help : ${ command }` )
			.addField( 'Usage', commandWrapper.usage )
			.addField( 'Purpose', commandWrapper.help );
	}

	return message.channel.send( { embed } );
}

list.Command( 'list', {
	func: async ( message: Message ) => {
		const commandList = Object.keys( list.list ).sort().join( '\n' );

		return message.channel.send( commandList );
	},
	help: 'Provides a list of commands',
} );
