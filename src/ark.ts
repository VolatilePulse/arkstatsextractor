import IA from 'interval-arithmetic';
import { Species } from './species';
import { Multipliers } from './mults';
import { TORPOR, IW, ID, STAT_COUNT, IB } from './consts';

interface SpeciesFormat {
    name: string;
    blueprintPath: string;
    TamedBaseHealthMultiplier: number;
    displayedStats: number;
    statImprintMult?: number[];
    fullStatsRaw: number[][];
}

export function CreateSpecies(s: SpeciesFormat): Species {
    const species: Species = new Species();
    species.blueprint = s.blueprintPath;
    species.name = s.name;
    species.stats = s.fullStatsRaw;
    species.torporIncrease = species.stats[TORPOR][IW];
    species.stats[TORPOR][IW] = 0;
    species.tbhm = s.TamedBaseHealthMultiplier;

    for (let i = 0; i < STAT_COUNT; i++) {
        species.displayedStats.push(!!(s.displayedStats & (1 << i)));

        if (species.stats[i] == null) species.stats[i] = [0, 0, 0, 0, 0];
        if (species.stats[i][ID] == 0) {
            species.canLevel[i] = false;

            if (species.stats[i][IW] == 0) species.dontUse[i] = true;
        }
    }

    if (s.statImprintMult) species.imprintMultiplier = s.statImprintMult;
    else species.imprintMultiplier = [0.2, 0, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0.2, 0, 0];

    return species;
}

export function CombineAllMults(speciesM: number[][], serverM: number[][]): Multipliers[] {
    const output: Multipliers[] = [];
    for (let stat = 0; stat < STAT_COUNT; stat++) {
        output.push(CombineMultipliers(speciesM[stat], serverM[stat]));
    }
    return output;
}

export function CombineMultipliers(speciesM: number[], serverM: number[]): Multipliers {
    const multipliers: number[] = speciesM;

    for (let i = IW; i <= IB; i++) {
        // If species multiplier is positive
        if (speciesM[i] > 0) multipliers.push(serverM[i + speciesM.length]);
        else multipliers.push(1);
    }

    // Prevent zero from becoming bounded
    const m = multipliers.map((x) => (x != 0 ? IA().boundedSingleton(x) : IA.ZERO));

    return new Multipliers(m);
}
