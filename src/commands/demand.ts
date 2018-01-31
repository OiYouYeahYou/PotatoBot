import { Message, PermissionResolvable, VoiceChannel } from "discord.js";
import {
  destructingReply,
  findVoiceChannel,
  randomString,
  safeDelete,
  somethingWentWrong,
  splitByFirstSpace,
  TEN
} from "../util";
import { list } from "../commands";

list.Command( 'demand', {
  func: demandRoom,
  help: 'Creates a \'Room of Requirement\'',
  usage: '[limit] [name]',
  // disabled: true,
} );

const REQUIRED_PERMISSONS: PermissionResolvable[] = [
  'MANAGE_CHANNELS', 'MOVE_MEMBERS'
];
const DEFAULT_NAME = 'Room of requirement';
const DEFAULT_ARGS: [ number, string ] = [ undefined, 'Room of requirement' ];
const position = 200;

async function demandRoom( message: Message, args: string ) {
  if ( !message.member.voiceChannel )
    return destructingReply( message, 'You need to be in a Voice Channel' );

  if ( !message.guild.me.hasPermission( REQUIRED_PERMISSONS ) )
    return destructingReply( message, 'The bot needs more permissons' );

  var tempName = randomString( 15 );

  await message.guild.createChannel( tempName, 'voice' )
  return newChannelHandler( message, tempName, args )
}

/**
 *
 * @param message Message event
 * @param tmpName Temporary name used to create and find channel
 * @param userLimit User limit to be set to
 * @param name Name for channel to be set too
 */
async function newChannelHandler(
  message: Message,
  tmpName: string,
  args: string
) {
  const { guild, member } = message;
  const channel: VoiceChannel = findVoiceChannel( guild, tmpName );

  if ( !channel ) {
    await safeDelete( message );

    return destructingReply( message, 'Channel can not be found, try again' );
  }

  const [ userLimit, name ] = processArgs( args );
  const parentChannel = guild.afkChannel.parent;
  const parent = parentChannel ? parentChannel.id : undefined;
  const reason = 'Setting up Temporary Channel';
  const config = { name, userLimit, parent, position };

  try {
    await channel.edit( config, reason )
    await member.setVoiceChannel( channel.id )
    initIntervalChecker( message, channel )
    await destructingReply( message, 'Done' )
  } catch ( error ) {
    await channel.delete()
    await somethingWentWrong( message, error )
  }

  return Promise.resolve();
}

/**
 * Processes arguments into an array of required variables
 * @param args
 */
function processArgs( args: string ): [ number, string ] {
  if ( !args )
    return DEFAULT_ARGS;

  var [ limitString, name ] = splitByFirstSpace( args );
  var limit = Number( limitString );

  if ( Number.isNaN( limit ) ) {
    limit = undefined;
    name = args;
  }

  if ( !name || name.length < 4 )
    name = DEFAULT_NAME;

  return [ limit, name ];
}

/**
 * Cretaes an interval that deletes the channel if the owner is not present
 * @param message
 * @param channel
 */
function initIntervalChecker( message: Message, channel: VoiceChannel ): void {
  const interval = message.client.setInterval( async () => {
    if ( message.member.voiceChannelID === channel.id )
      return;

    message.client.clearInterval( interval );

    await safeDelete( message );

    try {
      await channel.delete()
      await destructingReply( message, 'Channel is deleted' )
    } catch ( error ) {
      await destructingReply( message, 'Channel can\'t be deleted' )
    }
  }, TEN );
}
