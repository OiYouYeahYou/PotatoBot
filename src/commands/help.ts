import { Message } from "discord.js";
import { getCommandWrapper } from "../commands";
import { richEmbed } from "../discord/embed";

export const WrapperHelp = {
	func: helpFunction,
	help: 'this is not helpful',
	usage: ';bind <region> <username>',
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
			.addField( 'Usage', commandWrapper.usage || '*blank*' )
			.addField( 'Purpose', commandWrapper.help || '*blank*' );
	}

	message.channel.send( { embed } );
}
