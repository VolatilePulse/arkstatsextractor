import IA, {Interval} from 'interval-arithmetic';

export function* intFromRange(interval: Interval, fn?: (value: number) => number) {
   interval = IA.intersection(new IA(0, Infinity), interval);
   const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
   const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
   for (let i = min; i <= max; i++) yield i;
}