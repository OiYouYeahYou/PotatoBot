import Discord = require('discord.js');

export interface Summoner {
    id: number;
    accountId: number;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;

    name: string;

    // Custom Extensions
    region?: string;
    leagues?: Array< League >;
    tier: string;
    rank: string;
}

export interface League {
    tier: string;
    rank: string;
    leagueName: string;
    queueType: string;
    playerOrTeamId: string;
    playerOrTeamName: string;

    leaguePoints: number;
    wins: number;
    losses: number;

    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;

    // Custom Extensions
    sortScore: number;
}

export type botRes = void | true | string | undefined;

export interface bindingResults { [key: string]: bindingResult }
export interface bindingResult { [key: string]: Summoner }


export interface botFuncs { [key: string]: botFunc }
export type botFunc = botFuncInterface | false | object;
export interface botFuncInterface {
    help: string;
    usage: string;
    aliases: Array<string>;
    key: string;
    bind: () => Function
}
