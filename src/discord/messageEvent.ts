import { Message } from "discord.js";
import Request from "../classes/Request"
import list from "../list"
import { everyoneResponse } from "./features";


export async function messageHandler( msg: Message, text: string, pfx: string )
{
	if ( isPrefixed( pfx, text ) )
		await requestEvent( msg, text, pfx )
	else if ( msg.mentions.everyone )
		await everyoneResponse( msg )
}

async function requestEvent( message: Message, text: string, pfx: string )
{
	message.channel.startTyping( 1 )

	const req = new Request( message, pfx, text )
	const commandString = removePrefix( pfx, text )

	await list.commandRunner( req, commandString )

	message.channel.stopTyping( true )
}

export function isPrefixed( pfx: string, str: string )
{
	return str.length !== pfx.length
		&& pfx.length > 0
		&& str.startsWith( pfx )
}

function removePrefix( pfx: string, text: string )
{
	return text.slice( pfx.length ).trim()
}
