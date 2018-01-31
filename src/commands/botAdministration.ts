import { disconnect } from "../index";
import { destructingReply } from "../util";
import { exec } from "child_process";
import { Message } from "discord.js";
import { IApplicationWrapper } from "../commandList";

export const WrapperKill: IApplicationWrapper = {
	func: async ( message: Message ) => {
		console.log( 'Shutting down by Discord command' );

		await message.reply( 'MURRDERRRR!!!' )
		await disconnect();

		process.exit();
	},
	help: 'Destroys the message.',
	aliases: [ 'kys', ],
	permission: 'master',
};

export const WrapperRestart: IApplicationWrapper = {
	func: async ( message:Message ) => {
		const { env: { restartCommand } } = process

		if ( !restartCommand )
			return destructingReply( message,
				'This bot does not support restarting'
			)

		console.log( 'Restarting by Discord command' );

		await message.reply( 'I\'ll be a new bot!!!' )
		await disconnect();

		exec( restartCommand );
	},
	help: 'Destroys the message.',
	permission: 'master',
};

export const WrapperInvite = {
	func: async ( message ) => {
		const invite = await message.client.generateInvite()
		return message.channel.send( invite );
	},
	help: 'Provides a bot inviter link',
};


export const WrapperPing = {
	func: async ( message: Message ) =>
		message.reply( 'pong' ),
	help: 'Tests latency of the server',
	aliases: [ 'pong' ],
};
