import { disconnect } from '../mainFuncs'
import { destructingReply, codeWrap } from '../util'
import { exec } from 'child_process'
import { Message } from 'discord.js'
import { promisify } from 'util'
import List from '../classes/List';

const promisedExec = promisify( exec )
interface megh
{
	stdout: string
	stderr: string
}

let raceLock = false

export default function ( list: List )
{
	const command = list.addModule( 'bot', {
		help: 'Bot administration tools for Owner',
		permission: 'owner',
	} )

	command.addCommand( 'kill', {
		func: async ( message: Message ) =>
		{
			if ( raceLock )
				return message.reply( 'Cannot do that at his time' )

			raceLock = true

			console.log( 'Shutting down by Discord command' )

			await message.reply( 'MURRDERRRR!!!' )
			await disconnect()

			process.exit()
		},
		help: 'Destroys the bot.',
		aliases: [ 'kys', ],
		permission: 'master',
	} )

	command.addCommand( 'restart', {
		func: async ( message: Message ) =>
		{
			if ( raceLock )
				return message.reply( 'Cannot do that at his time' )

			raceLock = true

			const { env: { restartCommand } } = process

			if ( !restartCommand )
				return destructingReply( message,
					'This bot does not support restarting'
				)

			console.log( 'Restarting by Discord command' )

			await message.reply( 'I\'ll be a new bot!!!' )
			await disconnect()

			exec( restartCommand )
		},
		help: 'Restarts bot',
		permission: 'master',
	} )

	command.addCommand( 'update', {
		func: async ( message: Message ) =>
		{
			if ( raceLock )
				return message.reply( 'Cannot do that at his time' )

			raceLock = true

			console.log( 'Updating by Discord command' )

			const { env: { restartCommand } } = process
			const restartable = !!restartCommand

			const msg = await message.channel.send( rsMsg( restartable ) )
			const notification = Array.isArray( msg ) ? msg[ 0 ] : msg

			const pull = await promisedExec( 'git pull' )
			await notification.edit( rsMsg( restartable, pull ) )

			const gulp = await promisedExec( 'gulp' )
			await notification.edit( rsMsg( restartable, pull, gulp ) )

			if ( restartable )
			{
				await notification.edit( rsMsg( restartable, pull, gulp, true ) )
				await disconnect()
				exec( restartCommand )
			}
			else
				raceLock = false
		},
		help: 'Pulls, Builds and Restarts bot',
		permission: 'master',
	} )

	command.addCommand( 'invite', {
		func: async ( message ) =>
		{
			const invite = await message.client.generateInvite()
			return message.channel.send( invite )
		},
		help: 'Provides a bot inviter link',
	} )
}

function rsMsg(
	restartable: boolean, git?: megh, gulp?: megh, restarting = false
)
{
	const gitSanitised = git
		? `=== out ===\n${ git.stdout }\n=== err ==\n${ git.stderr }`
		: ''
	const gulpSanitised = gulp
		? `=== out ===\n${ gulp.stdout }\n=== err ==\n${ gulp.stderr }`
		: ''

	const gitMessage = `Git output:\n${ codeWrap( gitSanitised ) }`
	const gulpMessage = `Gulp output:\n${ codeWrap( gulpSanitised ) }`

	let restartMessage
	if ( !restartable )
		restartMessage = 'Restarting: `You will need to restart manually`'
	else if ( restarting )
		restartMessage = 'Restarting: `Restarting now`'
	else
		restartMessage = 'Restarting: `pending`'

	return [ gitMessage, gulpMessage, restartMessage ].join( '\n\n' )
}
