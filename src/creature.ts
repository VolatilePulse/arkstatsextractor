import { Species } from './species.js';
import { B, STAT_COUNT } from './consts.js';
import { FilledArray } from 'utils.js';

export class Creature {
    blueprint = '';
    level = 1;

    isWild = true;
    isTamed = false;
    isBred = false;

    imprint = 0;

    statusValues: number[] = FilledArray(STAT_COUNT, () => 0);

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
