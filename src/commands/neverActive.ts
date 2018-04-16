import Request from '../classes/Request';
import List from '../classes/List';

export default function ( list: List )
{

	list.addCommand( 'never', {
		func: never,
		help: 'Displays the number of people who have not sent a message',
	} )
}

export async function never( req: Request, args: string )
{
	var { guild } = req
	var { members } = guild

	var inactive = members.filterArray(
		member => member.lastMessage ? false : true
	)

	return req.reply( inactive.length )
}
