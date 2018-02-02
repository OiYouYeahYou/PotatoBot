import { Message, Guild as TGuild } from "discord.js";
import { destructingReply } from "../util";
import { list } from "../commands";
import { findGuildConfig, GuildConfigModel, configLists } from "../mongoose/guild";
import { isFeatureEnabled } from "../configManager";
import { all } from "../discord/featureEnum";
import { List } from "../commandList";

const command = list.addCommand( 'config', {
	help: 'Sets configuration preferences',
	permission: 'master',
	aliases: [ 'cfg' ],
	subCommands: new List,
} );

command.subCommands.addCommand( 'new', {
	func: subNew,
	help: 'Creates a new config for a Guild',
} );

command.subCommands.addCommand( 'features', {
	func: subEnabledFeatures,
	help: 'Returns enabled features,  or Checks if features are enabled',
} );

command.subCommands.addCommand( 'commands', {
	func: subEnabledcommands,
	help: 'Returns enabled commands,  or Checks if commands are enabled',
} )

async function subEnabledFeatures( message: Message, args: string ) {
	return enabledAggreator( message, args, 'features' )
}

async function subEnabledcommands( message: Message, args: string ) {
	return enabledAggreator( message, args, 'commands' )
}

async function enabledAggreator(
	message: Message,
	args: string,
	key: configLists
) {
	const { guild } = message;

	return message.reply(
		args
			? await checkEnabledList( guild, key, args )
			: await getEnabledList( guild, key )
	);
}

async function getEnabledList(
	guild: TGuild,
	key: configLists
): Promise<string> {
	const config = await findGuildConfig( guild );

	if ( !config )
		return Promise.resolve( 'No config available' );

	const list = config[ key ];
	const isAll = list.includes( all );

	return Promise.resolve(
		isAll
			? `All ${ key } are enabled`
			: `Enabled: ${ list.join( ', ' ) }`
	);
}

async function checkEnabledList(
	guild: TGuild,
	key: configLists,
	args: string
): Promise<string> {
	const items = args.split( ' ' )
	const enabled = [];
	const disabled = [];
	let reply

	for ( const item of items ) {
		const hmmm = await isFeatureEnabled( guild, item );
		( hmmm ? enabled : disabled ).push( item );
	}

	const stringEnabled = `Enabled: ${ enabled.join( ', ' ) }`;
	const stringDisabled = `Disabled: ${ disabled.join( ', ' ) }`;

	if ( enabled.length && disabled.length )
		reply = `${ stringEnabled }\n${ stringDisabled }`;
	else if ( enabled.length )
		reply = stringEnabled;
	else if ( disabled.length )
		reply = stringDisabled;
	else
		reply = 'Huh, nothing showed up?';

	return Promise.resolve( reply );
}

async function subNew( message: Message, args: string ) {
	const {
		channel: { id: defaultChannel },
		guild: { id: guildID },
	} = message

	const existingGuilds = await findGuildConfig( guildID );

	if ( existingGuilds )
		return destructingReply( message, 'This guild already has a config' );

	const settings = new GuildConfigModel( {
		guildID,
		defaultChannel,
		commands: [ all ],
		features: [ all ],
	} );

	try {
		await settings.save();
	} catch ( error ) {
		return message.reply( 'Failed to save' );
	}

	return message.reply( 'Saved' );
}
