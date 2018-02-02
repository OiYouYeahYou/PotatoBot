import { Message } from "discord.js";
import { splitByFirstSpace, requireInFile } from './util';
import List from './classes/List';

export const list = new List
requireInFile( 'commands' );
