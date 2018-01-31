import { Message } from "discord.js";
import { ICommand } from "../commandList";

export function hasAuthorityForCommand( message: Message, wrapper: ICommand ) {
	var { permission } = wrapper;

	if ( permission === 'all' )
		return true;
	else if ( permission === 'master' )
		return isMaster( message );
	else if ( permission === 'owner' )
		return isOwner( message ) || isMaster( message );
	else if ( permission === 'admin' )
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

export async function unauthorised( message: Message, wrap: ICommand ) {
	return message.reply(
		`You are not autorised to use that command, `
		+ `you must be a ${ wrap.permission }`
	);
}
