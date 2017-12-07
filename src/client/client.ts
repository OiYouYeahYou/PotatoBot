// tslint:disable-next-line:no-var-requires
require( 'source-map-support' ).install();

import { Client } from 'discord.js';
import { setEnv } from '../util';
import { guildMemberAdd, guildMemberRemove, messageRecived, ready } from './events';

setEnv();

const clientOptions = { fetchAllMembers: true };

export const client = new Client( clientOptions );

client.on( 'ready', ready );
client.on( 'message', messageRecived );
client.on( 'guildMemberAdd', guildMemberAdd );
client.on( 'guildMemberRemove', guildMemberRemove );
