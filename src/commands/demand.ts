import { Message, PermissionResolvable, VoiceChannel } from "discord.js";
import { IApplicationWrapper } from "../commands";
import {
  destructingReply,
  findVoiceChannel,
  randomString,
  safeDelete,
  somethingWentWrong,
  splitByFirstSpace,
  TEN
} from "../util";

export const WrapperDemand: IApplicationWrapper = {
  func: demandRoom,
  help: 'Creates a \'Room of Requirement\'',
  usage: '[limit] [name]',
  // disabled: true,
};

const REQUIRED_PERMISSONS: PermissionResolvable[] = [
  'MANAGE_CHANNELS', 'MOVE_MEMBERS'
];
const DEFAULT_NAME = 'Room of requirement';
const DEFAULT_ARGS: [ number, string ] = [ undefined, 'Room of requirement' ];
const position = 200;

function demandRoom( message: Message, args: string ): void {
  if ( !message.member.voiceChannel )
    return destructingReply( message, 'You need to be in a Voice Channel' );

  if ( !message.guild.me.hasPermission( REQUIRED_PERMISSONS ) )
    return destructingReply( message, 'The bot needs more permissons' );

  var tempName = randomString( 15 );

  message.guild.createChannel( tempName, 'voice' )
    .then( () => newChannelHandler( message, tempName, args ) )
    .catch( err => somethingWentWrong( message, err ) );
}

/**
 *
 * @param message Message event
 * @param tmpName Temporary name used to create and find channel
 * @param userLimit User limit to be set to
 * @param name Name for channel to be set too
 */
function newChannelHandler( message: Message, tmpName: string, args: string ): void {
  var channel: VoiceChannel = findVoiceChannel( message.guild, tmpName );

  if ( !channel ) {
    safeDelete( message );

    return destructingReply( message, 'Channel can not be found, try again' );
  }

  var [ userLimit, name ] = processArgs( args );
  var parent = message.guild.afkChannel.parent.id;
  var reason = 'Setting up Temporary Channel';
  var config = { name, userLimit, parent, position };

  channel.edit( config, reason )
    .then( () => message.member.setVoiceChannel( channel.id ) )
    .then( () => initIntervalChecker( message, channel ) )
    .then( () => destructingReply( message, 'Done' ) )
    .catch( err => somethingWentWrong( message, err ) );
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
  var interval = message.client.setInterval( () => {
    if ( message.member.voiceChannelID === channel.id )
      return;

    message.client.clearInterval( interval );

    safeDelete( message );

    channel.delete()
      .then( () => destructingReply( message, 'Channel is deleted' ) )
      .catch( () => destructingReply( message, 'Channel can\'t be deleted' ) );
  }, TEN );
}
