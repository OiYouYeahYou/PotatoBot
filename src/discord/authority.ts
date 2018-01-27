import { Message } from "discord.js";
import { ICommandWrapper } from "../commands";

export function hasAuthorityForCommand( message: Message, wrapper: ICommandWrapper ) {
	var { permisson } = wrapper;

	if ( permisson === 'all' )
		return true;
	else if ( permisson === 'master' )
		return isMaster( message );
	else if ( permisson === 'owner' )
		return isOwner( message ) || isMaster( message );
	else if ( permisson === 'admin' )
		return isAdmin( message );

	return false;
}

function isOwner( message: Message ) {
	return message.member.id === message.guild.ownerID;
}

function isMaster( message: Message ) {
	return message.member.id === process.env.master;
}

function isAdmin( message: Message ) {
	return message.member.hasPermission( 'ADMINISTRATOR' );
}

export function unauthorised( message: Message, wrapper: ICommandWrapper ) {
	message.reply(
		`You are not autorised to use that command, `
		+ `you must be a ${ wrapper.permisson }`
	).then( () => message.channel.stopTyping( true ) );
}
