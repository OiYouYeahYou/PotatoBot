import { Message } from 'discord.js';
import { prefix } from './constants';
import ListRunner from './classes/ListRunner';
import CommandRunner from './classes/CommandRunner';
import Command from './classes/Command';
import { IApplicationWrapper } from './classes/Command';

export class List {
	constructor() {
		this.runner = new ListRunner( this )
	}

	/** Contains Command instances */
	readonly list: { [ key: string ]: Command } = {}
	/** Class instance that conatains the logic for handling message events */
	readonly runner: ListRunner

	/** Creates a new class that is registered with list */
	addCommand( key: string, input: IApplicationWrapper ) {
		if ( input.disabled )
			return

		key = key.toLowerCase()

		const instance = new Command( key, input )

		this.register( key, instance )

		if ( input.aliases )
			for ( const alias of input.aliases )
				this.register( alias, instance )

		return instance
	}

	/** Registers new commands in list */
	private register( key: string, instance: Command ) {
		key = key.trim().toLowerCase()

		this.keyValidator( key )

		this.list[ key ] = instance
	}

	/** Validates new keys to prevent invalid chars and overwrites */
	private keyValidator( key: string ) {
		if ( key.indexOf( ' ' ) !== -1 )
			throw new Error( `Key contains space \'${ key }\'` )

		if ( key in this.list )
			throw new Error( `Key already exists in commands \'${ key }\'` )

		if ( key !== key.toLowerCase() )
			throw new Error( `Keys must be lowercase \'${ key }\'` )
	}

	/** Returns a command based on the key */
	getCommandWrapper( cmd: string ): Command | false {
		if ( cmd in this.list )
			return this.list[ cmd ]

		return false
	}
}

