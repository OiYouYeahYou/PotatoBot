export function nin( key, obj ) { return !( key in obj ); }

export function callCB( cb ) {
    if ( typeof cb === 'function' )
        return cb;
    else
        return noop;
}

export function noop() { }

export function NOGO() {
    var that = this;

    that.values = undefined;
    that.tester = function tester( condition, msg ) {
        if ( condition ) return true;

        if ( !that.values )
            that.values = new Error( msg );
        else if ( typeof that.values === 'string' )
            that.values = [ that.values, new Error( msg ) ];
        else if ( Array.isArray( that.values ) )
            that.values.push( new Error( msg ) );
    }
}

export function validatePrefix( pfx, string ) {
    return (
        typeof pfx === 'string' && pfx.length > 0 &&
        typeof string === 'string' && string.startsWith( pfx )
    );
}

export function quatch( trie?: any, fin?: any ) {
    try { callCB( trie )(); }
    catch ( e ) { console.log( e ); }
    finally { callCB( fin )(); }
}

// String indexOf that returns undefined instead of -1
export function indexOf( str: string, search: string, position?: number ): number | undefined
{
    var index: number = str.indexOf( search, position );
    return index > 0 ? index : undefined;
}
