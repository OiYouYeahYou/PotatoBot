import { IApplicationWrapper } from "../commands";
import { disconnect } from "../index";

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
