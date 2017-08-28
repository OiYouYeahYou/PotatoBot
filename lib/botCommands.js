"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint: disable
//@ts-check
/* jshint node : true, esversion : 6, laxbreak : true */
const Discord = require("discord.js");
const bind = require("./bind"); // External botCommand
exports.botFuncs = {
    bind, ping, sendhelp, avatar, wait, fancy, help, tantrum
};
var bindingResults = {};
// module.exports = { botFuncs, help };
//  //  //  //  //  Command Functions
function ping(message, args) {
    message.reply('pong');
    return;
}
function sendhelp(message, args) {
    return true;
}
function avatar(message, args) {
    message.reply(message.author.avatarURL);
    return;
}
function wait(message, args) {
    message.channel.startTyping(1);
    message.client.setTimeout(_ => {
        message.reply('I have waited');
        message.channel.stopTyping(true);
    }, 2000);
}
function fancy(message, args) {
    message.channel.send({ embed: richEmbed() });
    return;
}
function help(message, command, result) {
    console.log('here');
    var func = getFunc(command), embed = richEmbed();
    if (!func) {
        // TODO: Not a recognised command
        embed
            .setTitle(`Help : ${command} is not recognised`)
            .setDescription('Try using ;list to find your command');
    }
    else {
        embed
            .setTitle(`Help : ${command}`)
            .addField('Usage', func.usage)
            .addField('Purpose', func.help);
    }
    if (typeof result === 'string')
        embed.addField('What went wrong', result);
    message.channel.send({ embed });
    return;
}
exports.help = help;
function tantrum() { throw 'BooHoo : tantrum was called'; }
(function (tantrum) {
    tantrum.help = 'Throws an intentional tantrum';
    tantrum.usage = 'Throws an intentional tantrum';
})(tantrum || (tantrum = {}));
//  //  //  //  //  Help Text
// bind.help = 'this is not helpful';
// bind.usage = ';bind <region> <username>';
// sendhelp.help = 'there is no help';
//  //  //  //  //  Utilities
function verifyBotCommands(throwMe) {
    var throwYes;
    Object.keys(exports.botFuncs).forEach(key => {
        var pass = true, thisFunc = exports.botFuncs[key];
        test('Not lowercase', key === key.toLowerCase());
        test('Not function', typeof thisFunc === 'function');
        test('No help string', typeof thisFunc.help === 'string');
        test('No usage string', typeof thisFunc.usage === 'string');
        if (pass)
            console.log(`Pass for ${key}`);
        else
            throwYes = true;
        function test(name, condition) {
            if (condition)
                return;
            if (pass)
                console.warn(`Errors for : ${key}`);
            // console.warn( `${ key } : Not ${ name }`);
            pass = false;
        }
    });
    if (throwMe && throwYes)
        throw 'Bot Commands seem to be improperly labeled';
}
exports.verifyBotCommands = verifyBotCommands;
function getFunc(cmd) {
    if (cmd in exports.botFuncs && typeof exports.botFuncs[cmd] === 'function')
        return exports.botFuncs[cmd];
    else
        return false;
}
exports.getFunc = getFunc;
function richEmbed(message, cb) {
    var embed = new Discord.RichEmbed()
        .setAuthor('Potato Bot')
        .setColor(0x00AE86)
        .setFooter('Yours truly, your friendly neighbourhood bot');
    if (typeof cb === 'function') {
        cb(message, embed);
        message.channel.send({ embed });
    }
    else
        return embed;
}
//  //  //  //  //  Initialiser
Object.keys(exports.botFuncs).forEach((key) => {
    // Purpose:
    //		To propagate aliases
    //		Attach key / func name to self
    //		Bind func to self so that func can use this
    var origin = exports.botFuncs[key];
    origin.key = key;
    var func = exports.botFuncs[key] = origin.bind(origin);
    Object.assign(func, origin);
    if (Array.isArray(origin.aliases) && origin.aliases.length > 0)
        origin.aliases.forEach(alias => exports.botFuncs[alias] = func);
});
