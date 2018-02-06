import { disconnect } from '../index'
import { destructingReply, codeWrap } from '../util'
import { exec } from 'child_process'
import { Message } from 'discord.js'
import List from '../classes/List'
import { list } from '../commands'
import { promisify } from 'util';

const promisedExec = promisify( exec )
interface megh
{
	stdout: string
	stderr: string
}

let raceLock = false

const command = list.addCommand( 'bot', {
	help: 'Set of owner level commands to help administrate the bot',
	subCommands: new List,
	permission: 'owner',
} )

const sub = command.subCommands

sub.addCommand( 'kill', {
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
	help: 'Destroys the message.',
	aliases: [ 'kys', ],
	permission: 'master',
} )

sub.addCommand( 'restart', {
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
	help: 'Destroys the message.',
	permission: 'master',
} )

sub.addCommand( 'update', {
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
	help: 'Destroys the message.',
	permission: 'master',
} )

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

	const gitMessage = `Gulp output:\n${ codeWrap( gitSanitised ) }`
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

sub.addCommand( 'invite', {
	func: async ( message ) =>
	{
		const invite = await message.client.generateInvite()
		return message.channel.send( invite )
	},
	help: 'Provides a bot inviter link',
} )
