import List from "../classes/List";
import { Message } from "discord.js";
import { processCommandString } from "../util";
import { hasAuthorityForCommand, unauthorised } from "../discord/authority";

/** Logic for List class that handles Message events */
export default class ListRunner {
	/** Logic for List class that handles Message events */
	constructor( list: List ) {
		this.list = list
	}

	/** Parent class: List */
	private readonly list: List

	/**
	 * Processes input and calls Command runner,
	 * or informs User of missing command or lacking privlages
	 */
	async commandRunner( message: Message, text: string ) {
		let [ command, args ] = processCommandString( text )

		// Jason: Do not remove this!!! It is correct
		if ( !command )
			return // Ignore prefix only string

		const wrapper = this.list.getCommandWrapper( command )

		if ( !wrapper )
			await message.reply( `Cannot find \`${ command }\`` )
		else if ( !hasAuthorityForCommand( message, wrapper ) )
			await unauthorised( message, wrapper )
		else
			await wrapper.runner.runner( message, command, args )
	}
}
