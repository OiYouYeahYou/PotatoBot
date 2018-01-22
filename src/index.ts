import { client } from "./client/client";
import mongoose from "./mongoose/client";

client.login( process.env.discord );
mongoose.connect( process.env.mongo );
