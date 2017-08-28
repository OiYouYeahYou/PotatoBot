"use strict";
// tslint:disable
//@ts-check
/* jshint node : true, esversion : 6, laxbreak : true */
Object.defineProperty(exports, "__esModule", { value: true });
const kindred = require("./kindred");
kindred.andSummonerLeague('nallaj', 'euw', qikcb);
kindred.andSummonerLeague('DaahRealLeon', 'euw', qikcb);
kindred.andSummonerLeague('ØniHime', 'euw', qikcb);
kindred.andSummonerLeague('Socksinbox', 'euw', qikcb);
kindred.andSummonerLeague('O3i', 'euw', qikcb);
kindred.andSummonerLeague('panda bella', 'euw', qikcb);
kindred.andSummonerLeague('TT AstroSora', 'euw', qikcb);
kindred.andSummonerLeague('TT  AstroSora'.toLowerCase(), 'euw', qikcb);
kindred.andSummonerLeague('TT   AstroSora'.toUpperCase(), 'euw', qikcb);
kindred.andSummonerLeague('TT    AstroSora', 'euw', qikcb);
function qikcb(err, summoner, leagues) {
    console.log(summoner);
    console.log(err);
    console.log(leagues);
}
