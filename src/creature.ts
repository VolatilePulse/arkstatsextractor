import { Species } from './species.js';

export class Creature {
    blueprint = '';
    level = 1;

    isWild = true;
    isTamed = false;
    isBred = false;

    imprint = 0;

    statusValues: number[] = Array(12).fill(0);

    constructor(species: Species) {
        this.blueprint = species.blueprint;
        this.level = 1;
        this.isWild = true;
        this.isTamed = false;
        this.isBred = false;
        this.imprint = 0;

        for (let i = 0; i < 12; i++) {
            if (!species.displayedStats[i]) this.statusValues[i] = NaN;
            else this.statusValues[i] = species.stats[i][0];
        }
    }
}
