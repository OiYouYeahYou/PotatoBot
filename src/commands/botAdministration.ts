import { IApplicationWrapper } from "../commands";
import { disconnect } from "../index";
import { destructingReply } from "../util";
import { exec } from "child_process";

export const WrapperKill: IApplicationWrapper = {
	func: async ( message ) => {
		console.log( 'destroying' );
		await message.reply( 'MURRDERRRR!!!' )
		await disconnect();
		process.exit();
	},
	help: 'Destroys the message.',
	aliases: [ 'kys', ],
	permisson: 'master',
};

export const WrapperRestart: IApplicationWrapper = {
	func: async ( message ) => {
		const { env: { restartCommand } } = process

		if ( !restartCommand )
			return destructingReply( message,
				'This bot does not support restarting'
			)

		console.log( 'destroying' );
		await message.reply( 'MURRDERRRR!!!' )
		await disconnect();

		exec( restartCommand, ( err, stdout, stderr ) => {
			if ( err )
				return destructingReply( message, 'Execution failed' );

			console.log( `stdout: ${ stdout }` );
			console.log( `stderr: ${ stderr }` );
		} );
	},
	help: 'Destroys the message.',
	permisson: 'master',
};

export const WrapperInvite = {
	func: ( message ) => {
		message.client.generateInvite().then(
			link => message.channel.send( link )
		);
	},
	help: 'Provides a bot inviter link',
};


export const WrapperPing = {
	func: ( message ) => { message.reply( 'pong' ); },
	help: 'Tests latency of the server',
	aliases: [ 'pong' ],
};
