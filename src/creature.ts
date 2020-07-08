import { Species } from './species';
import { B, STAT_COUNT } from './consts';
import { FilledArray } from 'utils';

export class Creature {
    readonly blueprint: string;
    readonly level: number;

    readonly isWild: boolean;
    readonly isTamed: boolean;
    readonly isBred: boolean;

    readonly imprint: number;
    readonly statusValues: number[] = FilledArray(STAT_COUNT, () => 0);

    constructor(species: Species) {
        this.blueprint = species.blueprint;
        this.level = 1;
        this.isWild = true;
        this.isTamed = false;
        this.isBred = false;
        this.imprint = 0;

        for (let i = 0; i < STAT_COUNT; i++) {
            // TODO: Doesn't support export files
            if (!species.displayedStats[i]) this.statusValues[i] = NaN;
            else this.statusValues[i] = species.stats[i][B];
        }
    }
}
