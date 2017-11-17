export interface ISummoner {
	id: number;
	accountId: number;
	profileIconId: number;
	revisionDate: number;
	summonerLevel: number;

	name: string;

	// Custom Extensions
	region?: string;
	leagues?: ILeague[];
	tier: string;
	rank: string;
}

export interface ILeague {
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

export type TBotRes = void | true | string | undefined;

export interface IBindingResults { [ key: string ]: IBindingResult; }
export interface IBindingResult { [ key: string ]: ISummoner; }

export interface IBotFuncs { [ key: string ]: botFunc; }
export type botFunc = IBotFunc | false | object;
export interface IBotFunc {
	help: string;
	usage: string;
	aliases: string[];
	key: string;
	bind: () => () => void;
}
