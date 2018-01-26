import { client } from "./discord/client";
import mongoose from "./mongoose/client";

client.login( process.env.discord );
mongoose.connect( process.env.mongo );

export async function disconnect() {
	await client.destroy();
	await mongoose.disconnect();
}
