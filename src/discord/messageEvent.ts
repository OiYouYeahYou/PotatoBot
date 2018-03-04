import { Message } from "discord.js";
import Request from "../classes/Request"
import { everyoneResponse } from "./features";
import { Main } from "../classes/Main";


export async function messageHandler(
	app: Main,
	msg: Message,
	text: string,
	pfx: string
)
{
	if ( isPrefixed( pfx, text ) )
		await requestEvent( app, msg, text, pfx )
	else if ( msg.mentions.everyone )
		await everyoneResponse( msg )
}

async function requestEvent(
	app: Main,
	message: Message,
	text: string,
	pfx: string
)
{
	message.channel.startTyping( 1 )

	const { list } = app
	const req = new Request( app, message, pfx, text )
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
