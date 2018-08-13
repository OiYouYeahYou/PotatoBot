require( 'source-map-support' ).install()

import { Main } from './classes/Main'
import { setEnv } from './env'
import list from './list';
import { music } from './discord/music';

setEnv()

const { discord, mongo } = process.env

export const app = new Main( discord, mongo, list, music )

app.start()
