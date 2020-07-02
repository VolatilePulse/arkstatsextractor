import IA from 'interval-arithmetic';
import { ExtractLevelsFromTorpor } from './extractor';
import { Multipliers } from './cls/class';

const multipliers = Array(11).fill(IA.ZERO);
multipliers[0] = new IA(100);
const mults: Multipliers = new Multipliers(multipliers);

describe('ExtractLevels', () => {
   it('works with a basic test case', () => {
      const torpor = new IA(100);
      const imprint = IA.ZERO;
      const m = mults;
   
      const result = ExtractLevelsFromTorpor(1, torpor, IA.ONE, imprint, m, false);
   
      expect(result).toEqual([[1,0]]);
   })
   
   it('works with a wild level of 50', () => {
      const torpor = new IA(5000);
      const imprint = IA.ZERO;
      const m = mults;
   
      const result = ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m, false);
   
      expect(result).toEqual([[50,0]]);
   })
   
   it('works with a tamed level of 50 with Ta', () => {
      const torpor = new IA(5000.5);
      const imprint = IA.ZERO;
      const m = mults;
      m.Ta = new IA(0.5);
   
      const result = ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m, false);
   
      expect(result).toEqual([[50,0]]);
   })
   
   it('works with a tamed level of 75 with Ta and has 25 domestic levels', () => {
      const torpor = new IA(5000.5);
      const imprint = IA.ZERO;
      const m = mults;
   
      const result = ExtractLevelsFromTorpor(75, torpor, IA.ONE, imprint, m, false);
   
      expect(result).toEqual([[50,25]]);
   })
   
   it('works with a bred level of 50 with 100% imprint', () => {
      const torpor = new IA(6000.5);
      const imprint = IA.ONE;
      const m = mults;
      m.Ta = new IA(0.5);
      m.Ib = new IA(0.2);
   
      const result = ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, m, false);
   
      expect(result).toEqual([[50,0]]);
   })
   
   it('works with a bred level of 200 with 100% imprint and narrow IB range', () => {
      const torpor = new IA(102.45, 102.549999);
      const imprint = new IA(0.995, 1);
      const m = mults;
      m.Ta = new IA(0.5);
      m.Ib = new IA(0.2 * 0.0001);
   
      const result = ExtractLevelsFromTorpor(201, torpor, new IA(0.0001), imprint, m, false);
   
      expect(result).toEqual([[196,5], [197,4], [198,3], [199,2], [200,1], [201, 0]]);
   })

   it('throws an Error when Torpor can be leveled', () => {
      const m = mults;

      expect(() => ExtractLevelsFromTorpor(1, new IA(100), IA.ONE, IA.ZERO, m, true)).toThrow(Error);
   })
   
   it('throws an Error when Torpor has a Tm', () => {
      const m = mults;
      m.Tm = IA.ONE;

      expect(() => ExtractLevelsFromTorpor(1, new IA(100), IA.ONE, IA.ZERO, m, true)).toThrow(Error);
   })
   
   it('throws an Error when Torpor increase per level is IA.ZERO', () => {
      const m = mults;

      expect(() => ExtractLevelsFromTorpor(1, new IA(100), IA.ZERO, IA.ZERO, m, true)).toThrow(Error);
   })
})