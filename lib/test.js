"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('This is a test; Do not adjust your set.\n\n');
require('./env');
const bot_1 = require("./bot");
const kindred = require("./kindred");
setTimeout(() => { bot_1.client.destroy(); }, 10000);
kindred.andSummonerLeague('nallaj', 'euw', (err) => {
    if (err) {
        console.error('Kindred encountered an error,\n'
            + 'It might be because Rito has expired the key, again!');
        throw new Error(err);
    }
    else {
        console.log('Kindred, ok');
    }
});
