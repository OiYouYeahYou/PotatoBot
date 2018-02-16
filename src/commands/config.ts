import { Message, Guild as TGuild } from 'discord.js'
import { destructingReply } from '../util'
import { list } from '../commands'
import { findGuildConfig, GuildConfigModel, configLists } from '../mongoose/guild'
import { isFeatureEnabled, isCommandEnabled } from '../configManager'
import { all } from '../discord/featureEnum'

const command = list.addModule( 'config', {
	help: 'Sets configuration preferences',
	permission: 'master',
	aliases: [ 'cfg' ],
	subCommands: true
} )

command.addSubCommand( 'new', {
	func: createNewConfig,
	help: 'Creates a new config for a Guild',
} )

command.addSubCommand( 'features', {
	func: async ( message: Message, args: string ) =>
		enabledAggreator( message, args, 'features' ),
	help: 'Returns enabled features,  or Checks if features are enabled',
} )

command.addSubCommand( 'commands', {
	func: async ( message: Message, args: string ) =>
		enabledAggreator( message, args, 'commands' ),
	help: 'Returns enabled commands,  or Checks if commands are enabled',
} )

async function enabledAggreator( msg: Message, args: string, type: configLists )
{
	const response = args
		? await listEnabled( msg.guild, type, args )
		: await getEnabledList( msg.guild, type )

	return msg.channel.send( response )
}

async function getEnabledList( guild: TGuild, type: configLists )
{
	const config = await findGuildConfig( guild )

	if ( !config )
		return 'No config available'

	const list = config[ type ]
	const isAll = list.includes( all )
	return isAll
		? `All ${ type } are enabled`
		: `Enabled: ${ list.join( ', ' ) }`
}

async function listEnabled( guild: TGuild, type: configLists, args: string )
{
	const items = args.split( ' ' )
	const enabled = []
	const disabled = []
	const enabledChecker = type === 'features'
		? isFeatureEnabled : isCommandEnabled

	for ( const item of items )
		( await enabledChecker( guild, item )
			? enabled : disabled
		).push( item )

	if ( !enabled.length || !disabled.length )
		return 'Huh, nothing showed up?'

	const reply: string[] = []

	if ( enabled.length )
		reply.push( 'Enabled: ' + enabled.join( ', ' ) )
	if ( disabled.length )
		reply.push( 'Disabled: ' + disabled.join( ', ' ) )

	return reply.join( '\n' )
}

async function createNewConfig( message: Message, args: string )
{
	const {
		channel: { id: defaultChannel },
		guild: { id: guildID },
	} = message

	const existingGuilds = await findGuildConfig( guildID )

	if ( existingGuilds )
		return destructingReply( message, 'This guild already has a config' )

	const settings = new GuildConfigModel( {
		guildID,
		defaultChannel,
		commands: [ all ],
		features: [ all ],
	} )

	try
	{
		await settings.save()
	}
	catch ( error )
	{
		return message.reply( 'Failed to save' )
	}

	return message.reply( 'Saved' )
}
