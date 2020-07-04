import IA from 'interval-arithmetic';
import { intFromRange } from './utils';

describe('intFromRange', () => {
    it('[1, 0] should contain []', () => {
        expect(Array.from(intFromRange(IA(1, 0)))).toEqual([]);
    });

    it('[0,0] should be contain only [0]', () => {
        expect(Array.from(intFromRange(IA(0, 0)))).toEqual([0]);
    });

    it('[0,1] should contain [0,1]', () => {
        expect(Array.from(intFromRange(IA(0, 1)))).toEqual([0, 1]);
    });

    it('[0,1.5] should contain [0,1]', () => {
        expect(Array.from(intFromRange(IA(0, 1.5)))).toEqual([0, 1]);
    });

    it('[0.5,1.5] should contain [1]', () => {
        expect(Array.from(intFromRange(IA(0.5, 1.5)))).toEqual([1]);
    });

    it('[-0.5,1.5] should contain [0,1]', () => {
        expect(Array.from(intFromRange(IA(-0.5, 1.5)))).toEqual([0, 1]);
    });

    it('[-0.5,4.5] should contain [0,1,2,3,4]', () => {
        expect(Array.from(intFromRange(IA(-0.5, 4.5)))).toEqual([0, 1, 2, 3, 4]);
    });
});
