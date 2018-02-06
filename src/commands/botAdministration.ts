import { disconnect } from '../index'
import { destructingReply } from '../util'
import { exec } from 'child_process'
import { Message } from 'discord.js'
import List from '../classes/List'
import { list } from '../commands'

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

sub.addCommand( 'invite', {
	func: async ( message ) =>
	{
		const invite = await message.client.generateInvite()
		return message.channel.send( invite )
	},
	help: 'Provides a bot inviter link',
} )
