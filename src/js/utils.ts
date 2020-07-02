import IA, { Interval } from 'interval-arithmetic';
// import { servers } from '../api/servers'
import { stats } from '../api/stats';
import { Servers, Species } from './cls/data';

export function GatherData() {
    const servers: Servers = new Servers();
    const species: Species[] = [];
    const official = servers.official;
    const singleplayer = servers.singleplayer;

    for (const s of stats.species) species.push(new Species(stats.format, s));

    return { servers, species, official, singleplayer };
}

export function* intFromRange(interval: Interval, fn?: (value: number) => number): Generator<number> {
    interval = IA.intersection(new IA(0, Infinity), interval);
    const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
    const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
    for (let i = min; i <= max; i++) yield i;
}
