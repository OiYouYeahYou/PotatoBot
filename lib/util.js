"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nin(key, obj) { return !(key in obj); }
exports.nin = nin;
function callCB(cb) {
    if (typeof cb === 'function')
        return cb;
    else
        return noop;
}
exports.callCB = callCB;
function noop() { }
exports.noop = noop;
function NOGO() {
    var that = this;
    that.values = undefined;
    that.tester = function tester(condition, msg) {
        if (condition)
            return true;
        if (!that.values)
            that.values = new Error(msg);
        else if (typeof that.values === 'string')
            that.values = [that.values, new Error(msg)];
        else if (Array.isArray(that.values))
            that.values.push(new Error(msg));
    };
}
exports.NOGO = NOGO;
function validatePrefix(pfx, string) {
    return (typeof pfx === 'string' && pfx.length > 0 &&
        typeof string === 'string' && string.startsWith(pfx));
}
exports.validatePrefix = validatePrefix;
function quatch(trie, fin) {
    try {
        callCB(trie)();
    }
    catch (e) {
        console.log(e);
    }
    finally {
        callCB(fin)();
    }
}
exports.quatch = quatch;
// String indexOf that returns undefined instead of -1
function indexOf(str, search, position) {
    var index = str.indexOf(search, position);
    return index > 0 ? index : undefined;
}
exports.indexOf = indexOf;
