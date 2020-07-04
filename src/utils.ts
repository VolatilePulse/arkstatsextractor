import IA, { Interval } from 'interval-arithmetic';
import * as defaultServers from './api/servers';
import { stats } from './api/stats';
import { Species } from './species';
import { Multipliers } from './mults';

interface PresetData {
    servers: { official: number[][]; singleplayer: number[][] };
    species: Species[];
}

export function GatherData(): PresetData {
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
    species.torporIncrease = species.stats[2][1];
    species.stats[2][1] = 0;
    species.tbhm = s.TamedBaseHealthMultiplier;

    for (let i = 0; i < species.stats.length; i++) {
        species.displayedStats.push(!!(s.displayedStats & (1 << i)));

        if (species.stats[i] == null) species.stats[i] = [0, 0, 0, 0, 0];
        if (species.stats[i][2] == 0) {
            species.canLevel[i] = false;

            if (species.stats[i][1] == 0) species.dontUse[i] = true;
        }
    }

    if (s.statImprintMult) species.imprintMultiplier = s.statImprintMult;
    else species.imprintMultiplier = [0.2, 0, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0.2, 0, 0];

    return species;
}

export function CombineMultipliers(speciesM: number[], serverM: number[]): Multipliers {
    const multipliers: number[] = speciesM;

    for (let i = 1; i <= 5; i++) {
        if (speciesM[i] > 0) multipliers.push(serverM[i + 5]);
        else multipliers.push(1);
    }

    const m = multipliers.map((x) => (x != 0 ? IA().boundedSingleton(x) : IA.ZERO));

    return new Multipliers(m);
}

export function* intFromRange(interval: Interval, fn?: (value: number) => number): Generator<number> {
    interval = IA.intersection(IA(0, Infinity), interval);
    const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
    const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
    for (let i = min; i <= max; i++) yield i;
}
