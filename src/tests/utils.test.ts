import IA from 'interval-arithmetic';
import {
    IntFromRange,
    IntFromRangeReverse,
    IntervalFromDecimal,
    DoubleToFloatCeil,
    DoubleToFloatFloor,
    CalculateRangeFromValue,
} from '../utils';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('intFromRange', () => {
    it('[1, 0] should contain []', () => {
        expect(Array.from(IntFromRange(IA(1, 0)))).toEqual([]);
    });

    it('[0,0] should be contain only [0]', () => {
        expect(Array.from(IntFromRange(IA(0, 0)))).toEqual([0]);
    });

    it('[0,1] should contain [0,1]', () => {
        expect(Array.from(IntFromRange(IA(0, 1)))).toEqual([0, 1]);
    });

    it('[0,1.5] should contain [0,1]', () => {
        expect(Array.from(IntFromRange(IA(0, 1.5)))).toEqual([0, 1]);
    });

    it('[0.5,1.5] should contain [1]', () => {
        expect(Array.from(IntFromRange(IA(0.5, 1.5)))).toEqual([1]);
    });

    it('[-0.5,1.5] should contain [0,1]', () => {
        expect(Array.from(IntFromRange(IA(-0.5, 1.5)))).toEqual([0, 1]);
    });

    it('[-0.5,4.5] should contain [0,1,2,3,4]', () => {
        expect(Array.from(IntFromRange(IA(-0.5, 4.5)))).toEqual([0, 1, 2, 3, 4]);
    });
});

describe('intFromRangeReverse', () => {
    it('[1, 0] should contain []', () => {
        expect(Array.from(IntFromRangeReverse(IA(1, 0)))).toEqual([]);
    });

    it('[0,0] should be contain only [0]', () => {
        expect(Array.from(IntFromRangeReverse(IA(0, 0)))).toEqual([0]);
    });

    it('[0,1] should contain [1,0]', () => {
        expect(Array.from(IntFromRangeReverse(IA(0, 1)))).toEqual([1, 0]);
    });

    it('[0,1.5] should contain [1,0]', () => {
        expect(Array.from(IntFromRangeReverse(IA(0, 1.5)))).toEqual([1, 0]);
    });

    it('[0.5,1.5] should contain [1]', () => {
        expect(Array.from(IntFromRangeReverse(IA(0.5, 1.5)))).toEqual([1]);
    });

    it('[-0.5,1.5] should contain [1,0]', () => {
        expect(Array.from(IntFromRangeReverse(IA(-0.5, 1.5)))).toEqual([1, 0]);
    });

    it('[-0.5,4.5] should contain [4,3,2,1,0]', () => {
        expect(Array.from(IntFromRangeReverse(IA(-0.5, 4.5)))).toEqual([4, 3, 2, 1, 0]);
    });
});

describe('nextup and nextdown', () => {
    it('', () => {
        expect(DoubleToFloatCeil(99_999.95)).toBeCloseTo(99999.953125, 6);
        expect(DoubleToFloatCeil(99999.953125)).toBeCloseTo(99999.953125, 6);
        expect(DoubleToFloatFloor(99_999.95)).toBeCloseTo(99999.9453125, 6);
        expect(DoubleToFloatFloor(99999.9453125)).toBeCloseTo(99999.9453125, 6);
    });
});

describe('intervalFromDecimal', () => {
    it('...', () => {
        expect(IntervalFromDecimal(0, 1)).toMatchCloseTo({ lo: -0.05, hi: 0.05 }, 3);
        expect(IntervalFromDecimal(1_500.6, 1)).toMatchCloseTo({ lo: 1_500.55, hi: 1_500.65 }, 4);
        expect(IntervalFromDecimal(1_500.57, 1)).toMatchCloseTo({ lo: 1_500.55, hi: 1_500.65 }, 4);
        expect(IntervalFromDecimal(1_500.568, 1)).toMatchCloseTo({ lo: 1_500.55, hi: 1_500.65 }, 4);
        expect(IntervalFromDecimal(1_500.5675, 1)).toMatchCloseTo({ lo: 1_500.55, hi: 1_500.65 }, 4);

        expect(IntervalFromDecimal(1_000_000, 1)).toMatchCloseTo({ lo: 999_999.9375, hi: 1_000_000.0625 }, 5);
    });
});

describe('CalculateRangeFromValue', () => {
    it('small values return the full round range', () => {
        expect(CalculateRangeFromValue(1.0, 1, 1)).toMatchCloseTo({ lo: 0.95, hi: 1.05 }, 1);
        expect(CalculateRangeFromValue(1.0, 1, 2)).toMatchCloseTo({ lo: 0.95, hi: 1.05 }, 1);
        expect(CalculateRangeFromValue(1.0, 2)).toMatchCloseTo({ lo: 0.995, hi: 1.005 }, 2);
        expect(CalculateRangeFromValue(1.0, 6)).toMatchCloseTo({ lo: 0.9999995, hi: 1.0000005 }, 6);
    });

    it('mid-point values switch from round range to float error range', () => {
        expect(CalculateRangeFromValue(100_000.0, 2, 1)).toMatchCloseTo({ lo: 99_999.9921875, hi: 100_000.0078125 }, 4);
        expect(CalculateRangeFromValue(100_000.0, 1, 1)).toMatchCloseTo({ lo: 99_999.9453125, hi: 100_000.0546875 }, 4);
        expect(CalculateRangeFromValue(100_000.0, 0, 1)).toMatchCloseTo({ lo: 99_999.5, hi: 100_000.5 }, 4);
        // 99999.95d, 99999.953125, 99999.9609375

        expect(CalculateRangeFromValue(1_000_000.0, 1, 1)).toMatchCloseTo({ lo: 999_999.9375, hi: 1_000_000.0625 }, 4);
        expect(CalculateRangeFromValue(1_000_000.0, 0, 1)).toMatchCloseTo({ lo: 999_999.5, hi: 1_000_000.5 }, 4);

        expect(CalculateRangeFromValue(10_000_000.0, 1, 1)).toMatchCloseTo({ lo: 9_999_999, hi: 10_000_001 });
    });

    it('large values return the float error range with a given fudge factor', () => {
        expect(CalculateRangeFromValue(100_000_000.0, 1, 1)).toMatchCloseTo({ lo: 99_999_992, hi: 100_000_008 });
        expect(CalculateRangeFromValue(100_000_000.0, 5, 1)).toMatchCloseTo({ lo: 99_999_992, hi: 100_000_008 });
        expect(CalculateRangeFromValue(100_000_000.0, 1, 10)).toMatchCloseTo({ lo: 99_999_920, hi: 100_000_080 });
    });

    it('...', () => {
        expect(CalculateRangeFromValue(600_000.825, 6, 1)).toMatchCloseTo({ lo: 600_000.75, hi: 600_000.875 }); // 600_000.8125
        expect(CalculateRangeFromValue(93_000_123.6, 6, 1)).toMatchCloseTo({ lo: 93_000_112, hi: 93_000_128 }); // 93_000_120.0
        expect(CalculateRangeFromValue(10.4, 1, 1)).toMatchCloseTo({ lo: 10.35, hi: 10.45 }, 3);
        expect(CalculateRangeFromValue(1_500.5675, 1, 1)).toMatchCloseTo({ lo: 1_500.55, hi: 1_500.65 }, 4);
        // 1_500.5675048828125, 1500.567626953125
    });
});
