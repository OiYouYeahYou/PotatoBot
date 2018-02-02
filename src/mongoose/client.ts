import * as mongoose from 'mongoose'
import { Model, Document } from 'mongoose'

export default mongoose

const db = mongoose.connection
db.on( 'error', console.error.bind( console, 'connection error:' ) )
db.once( 'open', () => console.log( 'Connected to MongoDB' ) )

export const connect = uri => mongoose.connect( uri )
