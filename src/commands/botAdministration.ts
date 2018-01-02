import { IApplicationWrapper } from "../commands";


export const WrapperKill: IApplicationWrapper = {
	func: ( message ) => {
		console.log( 'destroying' );
		message.reply( 'MURRDERRRR!!!' ).then( () => {
			message.client.destroy()
				.then( () => { console.log( 'destroyed' ); } )
				.catch( () => { console.log( 'failing to destroy' ); } );
		} );
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
