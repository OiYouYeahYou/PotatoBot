import { Message } from 'discord.js'
import { hasAuthorityForCommand, unauthorised } from '../discord/authority'
import {
	maxStringLength,
	padLeft,
	padRight,
	processCommandString,
	removePrefix,
} from '../util/string'
import AbstractListItem, { IListItemInfo } from './AbstractListItem'
import Command, { ICommandInfo } from './Command'
import { Main } from './Main'
import Module from './Module'
import Request from './Request'

export default class List {
	/** Contains Command instances */
	readonly list: { [key: string]: AbstractListItem } = {}
	/** Contains Command instances */
	readonly listCondesed: { [key: string]: string[] } = {}

	/** Creates a new class that is registered with list */
	addCommand(key: string, input: ICommandInfo) {
		return this.addToList(Command, key, input)
	}

	/** Creates a new class that is registered with list */
	addModule(key: string, input: IListItemInfo) {
		return this.addToList(Module, key, input)
	}

	/** Returns a command based on the key */
	getCommandWrapper(cmd: string): AbstractListItem | false {
		if (cmd in this.list) return this.list[cmd]

		return false
	}

	/** Creates a summary of commands, subcommands and their help texts */
	toSummary(pad: number = 0) {
		const commandList = Object.keys(this.listCondesed)
		const items: string[] = []
		const maxLen = maxStringLength(commandList)
		const leftPadding = padLeft('', pad)

		for (const key of commandList) {
			const wrapper = this.getCommandWrapper(key)

			if (!wrapper) continue

			const keyText = padRight(key, maxLen)
			const aliases = this.listCondesed[key]
			let commandInfo = `${leftPadding}${keyText} - ${wrapper.help}`

			if (aliases.length) commandInfo += ` - [ ${aliases.join(', ')} ]`

			if (wrapper instanceof Module)
				commandInfo += '\n' + wrapper.subCommands.toSummary(pad + 2)

			items.push(commandInfo)
		}

		return items.sort().join('\n')
	}

	async run(app: Main, message: Message, text: string, prefix: string) {
		const req = new Request(app, this, message, prefix, text)
		const commandString = removePrefix(prefix, text)

		await this.commandRunner(req, commandString)
	}

	/**
	 * Processes input and calls Command runner,
	 * or informs User of missing command or lacking privlages
	 */
	async commandRunner(req: Request, text: string) {
		const [command, args] = processCommandString(text)

		// Jason: Do not remove this!!! It is correct
		if (!command) return // Ignore prefix only string

		const wrapper = this.getCommandWrapper(command)

		if (!wrapper) return
		// Ignore
		else if (!hasAuthorityForCommand(req, wrapper))
			return unauthorised(req, wrapper)

		req.channel.startTyping(1)
		await wrapper.runner(req, command, args)
		req.channel.stopTyping(true)
	}

	/** Add a new item to the list, including as an alias */
	private addToList<ItemClass extends AbstractListItem>(
		Inject: { new (key: string, input: any): ItemClass },
		key: string,
		input: any
	): ItemClass {
		if (input.disabled) return undefined

		key = key.toLowerCase()

		const instance = new Inject(key, input)

		this.registerMain(key, instance)

		if (input.aliases)
			for (const alias of input.aliases)
				this.registerAlias(key, alias, instance)

		return instance
	}

	/** Registers new commands in list */
	private register(key: string, instance: AbstractListItem) {
		key = key.trim().toLowerCase()
		this.keyValidator(key)
		this.list[key] = instance
	}

	/** Registers new commands in list */
	private registerMain(key: string, instance: AbstractListItem) {
		this.register(key, instance)
		this.listCondesed[key] = []
	}

	/** Registers new commands in list */
	private registerAlias(
		key: string,
		alias: string,
		instance: AbstractListItem
	) {
		this.register(alias, instance)
		this.listCondesed[key].push(alias)
	}

	/** Validates new keys to prevent invalid chars and overwrites */
	private keyValidator(key: string) {
		if (key.indexOf(' ') !== -1)
			throw new Error(`Key contains space \'${key}\'`)

		if (key in this.list)
			throw new Error(`Key already exists in commands \'${key}\'`)

		if (key !== key.toLowerCase())
			throw new Error(`Keys must be lowercase \'${key}\'`)
	}
}
