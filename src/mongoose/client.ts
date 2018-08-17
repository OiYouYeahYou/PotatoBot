import * as mongoose from 'mongoose'

export default mongoose

mongoose.connection.on(
	'error',
	console.error.bind(console, 'connection error:')
)
mongoose.connection.once('open', () => console.log('Connected to MongoDB'))
