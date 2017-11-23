import { Message } from "discord.js";
import { getCommandWrapper } from "../commands";
import { richEmbed } from "../discord/embed";

export const WrapperHelp = {
	func: helpFunction,
	help: 'Provides information about a command',
	usage: '<command>',
};

export function helpFunction( message: Message, command: string ) {
	var commandWrapper = getCommandWrapper( command ),
		embed = richEmbed();

	if ( !commandWrapper ) {
		// TODO: Not a recognised command
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

	message.channel.send( { embed } );
}
