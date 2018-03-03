require( 'source-map-support' ).install()

import { Main } from './classes/Main'
import { setEnv } from './env'

setEnv()

const { discord, mongo } = process.env

export const app = new Main( discord, mongo )

app.start()
