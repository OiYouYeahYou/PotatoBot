/** String indexOf that returns undefined instead of -1 */
export function indexOf(str: string, search: string, position?: number) {
	const index: number = str.indexOf(search, position)
	return index > 0 ? index : undefined
}

/**
 * Splits string into an array containg first word and remaining string
 * @param text
 */
export function splitByFirstSpace(text: string): [string, string] {
	text = text.trim()

	if (!text) {
		return ['', '']
	}

	const indexOfFirstSpace = indexOf(text, ' ')

	const a = text.slice(0, indexOfFirstSpace).trim()
	const b = indexOfFirstSpace ? text.slice(indexOfFirstSpace).trim() : ''

	return [a, b]
}

/**
 * Creates a random string of charecters
 * @param len The length of string to return
 *
 * Attribution: thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
 */
export function randomString(len: number) {
	let t = ''
	const pl = possible.length

	for (let i = 0; i < len; i++) {
		t += possible.charAt(Math.floor(Math.random() * pl))
	}

	return t
}
const possible =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Splits command string form rest  of text and lowercases the command
 * @param text
 */
export function processCommandString(text: string): [string, string] {
	let [command, args] = splitByFirstSpace(text)

	command = command.toLowerCase()

	return [command, args]
}

export function codeWrap(text: string, lang?: string) {
	return `\`\`\`${lang ? lang : ''}\n${text ? text : '...'}\n\`\`\``
}

export function padRight(text: string | number, len: number) {
	let res = text ? text.toString() : ''
	while (res.length < len) {
		res += ' '
	}

	return res
}

export function padLeft(text: string | number, len: number) {
	let res = text ? text.toString() : ''
	while (res.length < len) {
		res = ' ' + res
	}

	return res
}

export function maxStringLength(arr: string[]) {
	return arr.reduce((acc, str) => (str.length > acc ? str.length : acc), 0)
}

export function splitFirstWordAsNumber(
	args: string,
	def = 0
): [number, string] {
	if (!args) {
		return [def, '']
	}

	const [a, b] = splitByFirstSpace(args)
	const x = Number(a)

	if (Number.isNaN(x)) {
		return [def, b]
	}

	return [x, b]
}

export function isPrefixed(pfx: string, str: string) {
	return str.length !== pfx.length && pfx.length > 0 && str.startsWith(pfx)
}

export function removePrefix(pfx: string, text: string) {
	return text.slice(pfx.length).trim()
}
