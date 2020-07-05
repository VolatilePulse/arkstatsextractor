import { STAT_COUNT } from './consts';
import { FilledArray } from './utils';

export class Species {
    blueprint: string;
    name: string;
    stats: number[][];
    torporIncrease: number;
    dontUse: boolean[] = FilledArray(STAT_COUNT, () => false);
    canLevel: boolean[] = FilledArray(STAT_COUNT, () => true);
    imprintMultiplier: number[];
    displayedStats: boolean[] = [];
    tbhm: number;
    teMultiplier: number; // MaxTamingEffectivenessBaseLevelMultiplier
}
