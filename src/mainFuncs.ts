import client from "./discord/client";
import mongoose from "./mongoose/client";

export async function connect()
{
	await client.login( process.env.discord )
	await mongoose.connect( process.env.mongo )
}

export async function disconnect()
{
	await client.destroy()
	await mongoose.disconnect()
}
