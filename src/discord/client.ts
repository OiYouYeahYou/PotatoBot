// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install()

import { Client } from 'discord.js'
import { setEnv } from '../util'
import
{
	guildMemberAdd,
	guildMemberRemove,
	messageRecived,
	ready,
	error,
	disconnect,
	reconnecting
} from './events'

setEnv()

const clientOptions = { fetchAllMembers: true }

export const client = new Client( clientOptions )

client.on( 'ready', ready )
client.on( 'error', error )
client.on( 'disconnect', disconnect )
client.on( 'reconnecting', reconnecting )
client.on( 'message', messageRecived )
client.on( 'guildMemberAdd', guildMemberAdd )
client.on( 'guildMemberRemove', guildMemberRemove )
