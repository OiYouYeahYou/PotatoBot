// tslint:disable-next-line
require('source-map-support').install()

import { Main } from './classes/Main'
import { music } from './discord/music/music'
import { setEnv } from './env'
import list from './list'

setEnv()

const { discord, mongo } = process.env

export const app = new Main(discord, mongo, list, music)

app.start()
