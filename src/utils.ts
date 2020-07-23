import IA, { Interval } from 'interval-arithmetic';
import * as nextfloat32 from 'math-float32-nextafter';
import * as float64ToFloat32 from 'float64-to-float32';

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

export function DoubleToFloatCeil(value: number): number {
    let result = nextfloat32(value, -Infinity);

    while (result < value) result = nextfloat32(result, Infinity);

    return result;
}
export function DoubleToFloatFloor(value: number): number {
    let result = nextfloat32(value, Infinity);

    while (result > value) result = nextfloat32(result, -Infinity);

    return result;
}

/**
 * Returns the Interval range of the previous and next float representation of value
 *
 * @param {number} value Value used to generate the range
 *
 * @return {Interval} Interval containing the value and the previous and next float.
 */
export function FloatRange(value: number): Interval {
    if (value === 0) return IA.ZERO;
    return IA(nextfloat32(value, -Infinity), nextfloat32(value, Infinity));
}

/**
 * Create an interval from a number, accounting for variations beyond the specified number of decimal places.
 *
 * @example intervalFromDecimal(0.1, 1) == Interval().halfOpenRight(0.05, 0.15)
 *
 * @param {number} value Value to convert to an interval
 * @param {number} places Number of "accurate" decimal places
 *
 * @return {Interval} Interval to represent the accurate range of the value
 */
// expect(CalculateRangeFromValue(1_000_000.0, 1, 1)).toMatchCloseTo({ lo: 999_999.875, hi: 1_000_000.125 }, 3);
// expect(CalculateRangeFromValue(1_000_000.0, 0, 1)).toMatchCloseTo({ lo: 999_999.5, hi: 1_000_000.5 });
// 999999.4375 = nextdown(999_999.5)
// 1000000.5625 = nextup(1000000.5)
export function IntervalFromDecimal(value: number, places: number): Interval {
    value = RoundTo(value, places);
    const offset = 5 * 10 ** -(places + 1);
    return IA(DoubleToFloatFloor(value - offset), DoubleToFloatCeil(value + offset));
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
export function* IntFromRange(interval: Interval, fn?: (value: number) => number): Generator<number> {
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
export function* IntFromRangeReverse(interval: Interval, fn?: (value: number) => number): Generator<number> {
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

/**
 * Creates an Interval centered around the value to help address float error.
 * The range also includes the values that could have been rounded to value.
 *
 * @param {number} value Value to create a range from
 * @param {number} places Number of decimal places the input was rounded to
 * @param {number} factor Multiplier to the float difference
 *
 * @returns {Interval} The range surrounding the value
 */
export function CalculateRangeFromValue(value: number, places: number, factor = 10): Interval {
    const asfloat = float64ToFloat32(value);

    const diff = (nextfloat32(asfloat, Infinity) - asfloat) * factor;

    const accRange = IA(asfloat - diff, asfloat + diff);
    const roundRange = IntervalFromDecimal(value, places);

    return IA.hull(accRange, roundRange);
}
