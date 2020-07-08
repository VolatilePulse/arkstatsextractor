import IA, { Interval } from 'interval-arithmetic';
import nextfloat32 from 'math-float32-nextafter';

/**
 * Rounds a number to a set decimal place for comparison
 *
 * @param {number} num Value that needs rounded
 * @param {number} places Number of decimals to be rounded to
 *
 * @returns {number} Decimal rounded to the specified precision
 */
export function RoundTo(num: number, places = 0): number {
    return +Number(num).toFixed(places);
}

/**
 * Returns the Interval range of the previous and next float representation of value
 *
 * @param {number} value Value used to generate the range
 *
 * @return {Interval} Interval containing the value and the previous and next float.
 */
export function floatRange(value: number): Interval {
    if (value === 0) return IA.ZERO;
    return IA(nextfloat32(value, -Infinity), nextfloat32(value, Infinity));
}

/**
 * Create an interval from a number, accounting for variations beyond the specified number of decimal places.
 *
 * @example intervalFromDecimal(0.1, 1) == Interval().halfOpenRight(0.05, 0.15)
 *
 * @param {number} value Value to convert to an interval
 * @param {number} places Number of "accurate" places
 *
 * @return {Interval} Interval to represent the accurate range of the value
 */
export function intervalFromDecimal(value: number, places: number): Interval {
    const offset = IA.mul(IA(5), IA.pow(IA(10), IA(-(places + 1))));
    return IA().halfOpenRight(floatRange(value - offset.hi).lo, floatRange(value + offset.hi).hi);
}

/**
 * Generator that returns all non-negative integers within an interval
 *
 * @param interval The interval to retrieve the integers from
 * @param fn Optional function to calculate the min and max. If no function is supplied,
 * Ceil and Floor are used to calculate the min and max, respectively.
 *
 * @yield A non-negative integer, starting with "min"
 */
export function* intFromRange(interval: Interval, fn?: (value: number) => number): Generator<number> {
    interval = IA.intersection(IA(0, Infinity), interval);
    const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
    const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
    for (let i = min; i <= max; i++) yield i;
}

/**
 * Generator that returns all non-negative integers within an interval, in reverse
 *
 * @param interval The interval to retrieve the integers from
 * @param fn Optional function to calculate the min and max. If no function is supplied,
 * Ceil and Floor are used to calculate the min and max, respectively.
 *
 * @yield A non-negative integer, starting with "max"
 */
export function* intFromRangeReverse(interval: Interval, fn?: (value: number) => number): Generator<number> {
    interval = IA.intersection(IA(0, Infinity), interval);
    const min = fn ? fn(interval.lo) : Math.ceil(interval.lo);
    const max = fn ? fn(interval.hi) : Math.floor(interval.hi);
    for (let i = max; i >= min; i--) yield i;
}

/**
 * Create an array pre-filled with data supplied by the given function.
 *
 * @example FilledArray(4, () => []) creates [[],[],[],[]].
 *
 * @param {number} length The length of the array
 * @param {function} fn A function to call to get the contents of an element, passed (undefined, index)
 *
 * @return {Array} An array of "length" containing the values/objects returned by "fn"
 */
export function FilledArray<T>(length: number, fn: (_: null, i: number) => T): T[] {
    return [...Array(length)].map(fn);
}
