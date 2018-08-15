export async function timer(time: number) {
	return new Promise((resolve, reject) => setTimeout(() => resolve(), time))
}

export async function safeCallAsync<T>(
	fn: (...args: any[]) => Promise<T>,
	...args: any[]
): Promise<[any, T]> {
	let val
	let err

	try {
		val = await fn(...args)
	} catch (error) {
		err = error
	}
	return [err, val]
}

export function injectHandler<T extends {}>(defaults: T, injects: any = {}): T {
	return Object.assign({}, defaults, injects)
}
