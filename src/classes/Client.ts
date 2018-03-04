import { Client } from 'discord.js'
import * as events from '../discord/events'
import { Main } from './Main';

export class Bot
{
	constructor( app: Main )
	{
		const clientOptions = { fetchAllMembers: true }

		const client = this.client = new Client( clientOptions )

		client.on( 'ready', () => events.ready( client ) )
		client.on( 'error', events.error )
		client.on( 'disconnect', events.disconnect )
		client.on( 'reconnecting', events.reconnecting )
		client.on( 'message', message => events.messageRecived( app, message ) )
		client.on( 'guildMemberAdd', events.guildMemberAdd )
		client.on( 'guildMemberRemove', events.guildMemberRemove )
	}

	readonly client: Client

	login( token: string )
	{
		return this.client.login( token )
	}

	destroy()
	{
		return this.client.destroy()
	}
}
