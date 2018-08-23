import { exec } from 'child_process'
import { promisify } from 'util'
import List from '../classes/List'
import Request from '../classes/Request'
import { codeWrap } from '../util/string'

const promisedExec = promisify(exec)
interface IStd {
	stdout: string
	stderr: string
}

let raceLock = false

export default function(list: List) {
	const module = list.addModule('bot', {
		help: 'Bot administration tools for Owner',
		permission: 'owner',
	})

	module.addCommand('kill', {
		aliases: ['kys'],
		func: async (req: Request) => {
			if (raceLock) {
				return req.reply('Cannot do that at his time')
			}

			raceLock = true

			req.logger.log('Shutting down by Discord command')

			await req.reply('MURRDERRRR!!!')
			await req.app.destroy()

			process.exit()
		},
		help: 'Destroys the bot.',
		permission: 'master',
	})

	module.addCommand('restart', {
		func: async (req: Request) => {
			if (raceLock) {
				return req.reply('Cannot do that at his time')
			}

			raceLock = true

			const {
				env: { restartCommand },
			} = process

			if (!restartCommand) {
				return req.destructingReply(
					'This bot does not support restarting'
				)
			}

			req.logger.log('Restarting by Discord command')

			await req.reply("I'll be a new bot!!!")
			await req.app.destroy()

			exec(restartCommand)
		},
		help: 'Restarts bot',
		permission: 'master',
	})

	module.addCommand('update', {
		func: async (req: Request) => {
			if (raceLock) {
				return req.reply('Cannot do that at his time')
			}

			raceLock = true

			req.logger.log('Updating by Discord command')

			const { restartCommand } = process.env
			const restartable = !!restartCommand
			const curry = currier(restartable)
			const notification = await req.send(curry())
			let pull
			let npm

			try {
				pull = await promisedExec('git pull')
				await notification.edit(curry(pull))

				npm = await promisedExec('npm i')
				await notification.edit(curry(pull, npm))
			} catch (err) {
				req.somethingWentWrong(err)
			} finally {
				if (restartable) {
					await notification.edit(curry(pull, npm, true))
					await req.app.destroy()
					exec(restartCommand)
				} else {
					raceLock = false
				}
			}
		},
		help: 'Pulls, Builds and Restarts bot',
		permission: 'master',
	})

	module.addCommand('invite', {
		func: async (req: Request) => {
			const invite = await req.client.generateInvite()
			return req.send(invite)
		},
		help: 'Provides a bot inviter link',
	})
}

function currier(restartable: boolean) {
	return (git?: IStd, npm?: IStd, restarting?: boolean) =>
		[
			sanitiseOutput('git', git),
			sanitiseOutput('npm', npm),
			restartMessage(restartable, restarting),
		].join('\n\n')
}

const sanitiseOutput = (name: string, std: IStd) =>
	name +
	' output:\n' +
	codeWrap(std ? `=== out ===\n${std.stdout}\n=== err ==\n${std.stderr}` : '')

function restartMessage(restartable: boolean, restarting: boolean) {
	if (!restartable) {
		return 'You will need to restart manually'
	} else if (restarting) {
		return 'Restart: `Restarting now`'
	}

	return 'Restart: `pending`'
}
