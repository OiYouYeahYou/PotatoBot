import List from '../classes/List'
import Request from '../classes/Request'
import { all } from '../discord/featureEnum'
import { configLists } from '../mongoose/Database'

export default function(list: List) {
	const module = list.addModule('config', {
		aliases: ['cfg'],
		help: 'Sets configuration preferences',
		permission: 'master',
	})

	module.addCommand('new', {
		func: createNewConfig,
		help: 'Creates a new config for a Guild',
	})

	module.addCommand('features', {
		func: async (req: Request, args: string) =>
			enabledAggreator(req, args, 'features'),
		help: 'Returns enabled features,  or Checks if features are enabled',
	})

	module.addCommand('commands', {
		func: async (req: Request, args: string) =>
			enabledAggreator(req, args, 'commands'),
		help: 'Returns enabled commands,  or Checks if commands are enabled',
	})
}

async function enabledAggreator(req: Request, args: string, type: configLists) {
	const response = args
		? await listEnabled(req, type, args)
		: await getEnabledList(req, type)

	return req.send(response)
}

async function getEnabledList(req: Request, type: configLists) {
	const config = await req.app.database.findGuildConfig(req.guild)

	if (!config) {
		return 'No config available'
	}

	const list = config[type]
	const isAll = list.includes(all)
	return isAll ? `All ${type} are enabled` : `Enabled: ${list.join(', ')}`
}

async function listEnabled(req: Request, type: configLists, args: string) {
	const items = args.split(' ')
	const enabled: string[] = []
	const disabled: string[] = []
	const enabledChecker =
		type === 'features'
			? req.app.database.isFeatureEnabled
			: req.app.database.isCommandEnabled

	for (const item of items) {
		const targetArray = (await enabledChecker(req.guild, item))
			? enabled
			: disabled

		targetArray.push(item)
	}

	if (!enabled.length || !disabled.length) {
		return 'Huh, nothing showed up?'
	}

	const reply: string[] = []

	if (enabled.length) {
		reply.push('Enabled: ' + enabled.join(', '))
	}
	if (disabled.length) {
		reply.push('Disabled: ' + disabled.join(', '))
	}

	return reply.join('\n')
}

async function createNewConfig(req: Request) {
	const {
		channel: { id: defaultChannel },
		guild: { id: guildID },
	} = req

	const existingGuilds = await req.app.database.findGuildConfig(guildID)

	if (existingGuilds) {
		return req.destructingReply('This guild already has a config')
	}

	const settings = new req.app.database.GuildConfigModel({
		commands: [all],
		defaultChannel,
		features: [all],
		guildID,
	})

	try {
		await settings.save()
	} catch (error) {
		return req.reply('Failed to save')
	}

	return req.reply('Saved')
}
