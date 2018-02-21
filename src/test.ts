console.log( 'This is a test Do not adjust your set.\n\n' )

import client from './discord/client'
import { setEnv } from './mainFuncs'

setEnv()

setTimeout( () => client.destroy(), 10000 )
