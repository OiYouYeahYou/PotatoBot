export function injectHandler<T extends {}>(
	defaults: T,
	injects: any = {}
): T
{
	return Object.assign({}, defaults, injects)
}
