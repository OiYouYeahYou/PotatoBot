import { Message } from "discord.js";
import { splitByFirstSpace, requireInFile } from './util';
import { List } from './commandList';

export const list = new List
requireInFile( 'commands' );
