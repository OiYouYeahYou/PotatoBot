/** Checks if env exists, and sets if they don't */
export function setEnv() {
	const keys = ['discord', 'ritoplz', 'mongo']

	const actionNeeded = !keys.every(key => key in process.env)

	if (actionNeeded) require('dotenv').config()

	const missingEnv = keys.filter(key => !(key in process.env))

	if (missingEnv.length) {
		const missingString = missingEnv.join(', ')
		throw new Error(`Enviromentals missing: ${missingString}`)
	}
}
