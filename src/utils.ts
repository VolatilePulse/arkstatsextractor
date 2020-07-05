import IA, { Interval } from 'interval-arithmetic';
import * as defaultServers from './api/servers';
import { stats } from './api/stats';
import { Species } from './species';
import { Multipliers } from './mults';
import { TORPOR, IW, ID, STAT_COUNT, IB } from './consts';

export interface PresetData {
    servers: { official: number[][]; singleplayer: number[][] };
    species: Species[];
}

export function GetGlobalData(): PresetData {
    const servers = defaultServers.servers;
    const species: Species[] = [];

    for (const s of stats.species) species.push(CreateSpecies(s));

    return { servers, species };
}

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

export function* intFromRange(interval: Interval, fn?: (value: number) => number): Generator<number> {
    interval = IA.intersection(IA(0, Infinity), interval);
    const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
    const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
    for (let i = min; i <= max; i++) yield i;
}

/**
 * Create an array pre-filled with data supplied by the given function. Example FilledArray(4, () => []) creates [[],[],[],[]].
 * @param {number} length The length of the array
 * @param {function} fn A function to call to get the contents of an element, passed (undefined, index)
 */
export function FilledArray<T>(length: number, fn: (_: null, i: number) => T): T[] {
    return [...Array(length)].map(fn);
}
