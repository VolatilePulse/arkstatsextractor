import { STAT_COUNT } from './consts';
import { FilledArray } from './utils';

export class Species {
    readonly blueprint: string;
    readonly name: string;
    readonly stats: number[][];
    readonly torporIncrease: number;
    readonly dontUse: boolean[] = FilledArray(STAT_COUNT, () => false);
    readonly canLevel: boolean[] = FilledArray(STAT_COUNT, () => true);
    readonly imprintMultiplier: number[];
    readonly displayedStats: boolean[] = [];
    readonly tbhm: number;
    readonly teMultiplier: number; // MaxTamingEffectivenessBaseLevelMultiplier

    constructor(
        blueprint: string,
        name: string,
        stats: number[][],
        torporIncrease: number,
        dontUse: boolean[],
        canLevel: boolean[],
        imprintMultiplier: number[],
        displayedStats: boolean[],
        tbhm: number,
        teMultiplier: number,
    ) {
        this.blueprint = blueprint;
        this.name = name;
        this.stats = stats;
        this.torporIncrease = torporIncrease;
        this.dontUse = dontUse;
        this.canLevel = canLevel;
        this.imprintMultiplier = imprintMultiplier;
        this.displayedStats = displayedStats;
        this.tbhm = tbhm;
        this.teMultiplier = teMultiplier;
    }
}
