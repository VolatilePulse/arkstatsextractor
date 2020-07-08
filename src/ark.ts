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
    const blueprint = s.blueprintPath;
    const name = s.name;
    const stats = s.fullStatsRaw;
    const torporIncrease = stats[TORPOR][IW];
    stats[TORPOR][IW] = 0;
    const tbhm = s.TamedBaseHealthMultiplier;
    const displayedStats: boolean[] = [];
    const canLevel: boolean[] = [];
    const dontUse: boolean[] = [];
    const teMultiplier = 0.5;
    const imprintMultiplier = s.statImprintMult
        ? s.statImprintMult
        : [0.2, 0, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0.2, 0, 0];

    for (let i = 0; i < STAT_COUNT; i++) {
        displayedStats.push(!!(s.displayedStats & (1 << i)));

        if (stats[i] == null) stats[i] = [0, 0, 0, 0, 0];
        if (stats[i][ID] == 0) {
            canLevel[i] = false;

            if (stats[i][IW] == 0) dontUse[i] = true;
        }
    }

    return new Species(
        blueprint,
        name,
        stats,
        torporIncrease,
        dontUse,
        canLevel,
        imprintMultiplier,
        displayedStats,
        tbhm,
        teMultiplier,
    );
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
        if (speciesM[i] > 0) multipliers.push(serverM[i - 1]);
        else multipliers.push(1);
    }

    // Prevent zero from becoming bounded
    const m = multipliers.map((x) => (x != 0 ? IA().boundedSingleton(x) : IA.ZERO));

    return new Multipliers(m);
}
