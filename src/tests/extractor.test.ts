import IA from 'interval-arithmetic';
import * as Extractor from '../extractor';
import * as Utils from '../utils';
import { CombineMultipliers } from '../ark';
import * as data from '../data';
import { Server } from '../server';
import { STAT_COUNT, HEALTH, CRAFTING } from '../consts';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

jest.mock('../data');
const mockedData = data as jest.Mocked<typeof data>;

describe('CalculateServerMults', () => {
    const fakePresetData = {
        servers: {
            official: Utils.FilledArray(STAT_COUNT, () => Utils.FilledArray(5, () => 3)),
            singleplayer: Utils.FilledArray(STAT_COUNT, () => Utils.FilledArray(5, () => 4)),
        },
        species: [],
    };
    mockedData.GetPresetData.mockReturnValue(fakePresetData);

    it('properly multiplies singleplayer multipliers to the default multipliers', () => {
        const test = Server.FromOfficial(true);

        const result = Extractor.CalculateServerMults(test);

        expect(data.GetPresetData).toHaveBeenCalled();
        expect(result[0][0]).toEqual(12);
        expect(result[0][2]).toEqual(12);
        expect(result[8][3]).toEqual(12);
    });
    it("doesn't modify the multipliers if singleplayer is false", () => {
        const test = Server.FromOfficial();

        const result = Extractor.CalculateServerMults(test);

        expect(data.GetPresetData).toHaveBeenCalled();
        expect(result[0][0]).toEqual(3);
        expect(result[0][2]).toEqual(3);
        expect(result[8][3]).toEqual(3);
    });
    it("doesn't modify the input multipliers", () => {
        const test = Server.FromOfficial(true);

        Extractor.CalculateServerMults(test);
        const mults = test.multipliers;

        expect(data.GetPresetData).toHaveBeenCalled();
        expect(mults[0][0]).toEqual(3);
        expect(mults[0][2]).toEqual(3);
        expect(mults[8][3]).toEqual(3);
    });
});

describe('ExtractLevels', () => {
    const speciesTorpor = [100, 0, 0, 0, 0, 0];
    const serverTorpor = [0, 0, 0, 0, 0];
    const mults = CombineMultipliers(speciesTorpor, serverTorpor);
    it('works with a basic test case', () => {
        const torpor = IA(100);
        const imprint = IA.ZERO;
        const m = mults;

        const result = Extractor.ExtractLevelsFromTorpor(1, torpor, IA.ONE, imprint, m);

        expect(result).toEqual([[1, 0]]);
    });

    it('works with a wild level of 50', () => {
        const torpor = IA(5000);
        const imprint = IA.ZERO;
        const m = mults;

        const result = Extractor.ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m);

        expect(result).toEqual([[50, 0]]);
    });

    it('works with a tamed level of 50 with Ta', () => {
        const torpor = IA(5000.5);
        const imprint = IA.ZERO;
        const speciesT = [100, 0, 0, 0.5, 0, 0];
        const serverT = [0, 0, 1, 0, 0];
        const m = CombineMultipliers(speciesT, serverT);
        const result = Extractor.ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m);

        expect(result).toEqual([[50, 0]]);
    });

    it('works with a tamed level of 75 with Ta and has 25 domestic levels', () => {
        const torpor = IA(5000.5);
        const imprint = IA.ZERO;
        const speciesT = [100, 0, 0, 0.5, 0, 0];
        const serverT = [0, 0, 1, 0, 0];
        const m = CombineMultipliers(speciesT, serverT);

        const result = Extractor.ExtractLevelsFromTorpor(75, torpor, IA.ONE, imprint, m);

        expect(result).toEqual([[50, 25]]);
    });

    it('works with a bred level of 50 with 100% imprint', () => {
        const torpor = IA(6000.5);
        const imprint = IA.ONE;
        const speciesT = [100, 0, 0, 0.5, 0, 0.2];
        const serverT = [0, 0, 1, 0, 1];
        const m = CombineMultipliers(speciesT, serverT);
        const result = Extractor.ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m);

        expect(result).toEqual([[50, 0]]);
    });

    it('works with a bred level of 200 with 100% imprint and narrow IB range', () => {
        const torpor = IA(102.45, 102.549999);
        const imprint = IA(0.995, 1);
        const speciesT = [100, 0, 0, 0.5, 0, 0.2];
        const serverT = [0, 0, 1, 0, 0.0001];
        const m = CombineMultipliers(speciesT, serverT);

        const result = Extractor.ExtractLevelsFromTorpor(201, torpor, IA(0.0001), imprint, m);

        expect(result).toEqual([
            [196, 5],
            [197, 4],
            [198, 3],
            [199, 2],
            [200, 1],
            [201, 0],
        ]);
    });

    it('throws an Error when Torpor can be leveled', () => {
        const speciesTorpor = [100, 0, 1, 0, 1, 0];
        const serverTorpor = [0, 0, 1, 1, 0];
        const m = CombineMultipliers(speciesTorpor, serverTorpor);

        expect(() => Extractor.ExtractLevelsFromTorpor(1, IA(100), IA.ONE, IA.ZERO, m)).toThrow(Error);
    });

    it('throws an Error when Torpor has a Tm', () => {
        const speciesTorpor = [100, 0, 0, 0, 1, 0];
        const serverTorpor = [0, 0, 0, 1, 0];
        const m = CombineMultipliers(speciesTorpor, serverTorpor);

        expect(() => Extractor.ExtractLevelsFromTorpor(1, IA(100), IA.ONE, IA.ZERO, m)).toThrow(Error);
    });

    it('throws an Error when Torpor increase per level is IA.ZERO', () => {
        const m = mults;

        expect(() => Extractor.ExtractLevelsFromTorpor(1, IA(100), IA.ZERO, IA.ZERO, m)).toThrow(Error);
    });
});

describe('ConvertCreatureValuesToRanges', () => {
    it('converts basic values from Ark', () => {
        const input = Utils.FilledArray(12, () => 100);
        const result = Extractor.ConvertCreatureValuesToRanges(input, false);
        expect(result[HEALTH]).toMatchCloseTo({ lo: 99.95, hi: 100.05 }, 1);
        expect(result[CRAFTING]).toMatchCloseTo({ lo: 99.95, hi: 100.05 }, 1);
    });
    it('converts basic values from export files', () => {
        const input = Utils.FilledArray(12, () => 100);
        const result = Extractor.ConvertCreatureValuesToRanges(input, true);
        // We only check 4 places due to significant digits and a rounding factor of 10
        expect(result[HEALTH]).toMatchCloseTo({ lo: 99.9999995, hi: 100.0000005 }, 4);
        expect(result[CRAFTING]).toMatchCloseTo({ lo: 99.9999995, hi: 100.0000005 }, 4);
    });
    it('creates precise ranges for small values', () => {
        const input = Utils.FilledArray(12, () => 1);
        const result = Extractor.ConvertCreatureValuesToRanges(input, true);
        // We only check 6 places due to a rounding factor of 10
        expect(result[HEALTH]).toMatchCloseTo({ lo: 0.9999995, hi: 1.0000005 }, 6);
        expect(result[CRAFTING]).toMatchCloseTo({ lo: 0.9999995, hi: 1.0000005 }, 6);
    });
});

describe('PrepareValues', () => {
    it('converts basic values from Ark', () => {
        const input = Utils.FilledArray(12, () => IA(100));
        const result = Extractor.PrepareValues(input, false);
        expect(result[HEALTH]).toMatchCloseTo({ lo: 100, hi: 100 });
        expect(result[CRAFTING]).toMatchCloseTo({ lo: 1, hi: 1 });
    });
    it('converts basic values from export files', () => {
        const input = Utils.FilledArray(12, () => IA(100));
        const result = Extractor.PrepareValues(input, true);
        expect(result[HEALTH]).toMatchCloseTo({ lo: 100, hi: 100 });
        expect(result[CRAFTING]).toMatchCloseTo({ lo: 101, hi: 101 });
    });
});
