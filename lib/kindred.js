"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./env');
const kindred = require("kindred-api");
const u = require("./util");
// export var kindred = kindred; // FIXME:
// console.log( env );
// console.log( process.env );
// env.dontShakeMe()
exports.k = new kindred.Kindred({
    key: process.env.ritoplz,
});
exports.regions = Object.keys(kindred.REGIONS).reduce((obj, key) => {
    obj[kindred.REGIONS[key]] = key;
    return obj;
}, {}), exports.regionsArray = Object.keys(exports.regions), exports.regionsString = exports.regionsArray.join(', ');
module.exports = {
    kindred, k: exports.k, andSummonerLeague, regions: exports.regions, regionsArray: exports.regionsArray, regionsString: exports.regionsString,
};
function andSummonerLeague(name, region, cb) {
    var nogo = new u.NOGO();
    nogo.tester(typeof name === 'string', 'name parameter is not string');
    nogo.tester(typeof region === 'string', 'region parameter is not string');
    nogo.tester(region in exports.regions, 'region parameter is not valid');
    nogo.tester(cb && typeof cb === 'function', 'callback is not a function');
    if (nogo.values)
        return u.callCB(cb)(nogo.values, name);
    exports.k.Summoner.by.name(name, region, getleague.bind(null, name, region, cb));
}
exports.andSummonerLeague = andSummonerLeague;
function getleague(name, region, cb, err, summoner) {
    if (err) {
        console.error(`Error: ${name}`);
        console.error(err);
        u.callCB(cb)(err, summoner);
        return;
    }
    summoner.region = region;
    exports.k.League.positions(summoner, (err, leagues) => {
        u.callCB(cb)(err, summoner, leagues);
    });
}
exports.getleague = getleague;
