import IA from 'interval-arithmetic'
import { ExtractLevelsFromTorpor } from './extractor';
// wildTamedBred = 1: wild, 2: tamed, 3: bred
// multipliers = [B, Iw, Id, Ta, Tm, IwM, IdM, TaM, TmM, IBM]

// Extract creature base & domestic levels
// function ExtractLevels(level: number, wildTamedBred: number, torpor: Interval, imprint: Interval, multipliers: Interval[]): any {

// }

test('ExtractLevels() works with a basic test case', () => {
   let torpor = new IA(100);
   let imprint = IA.ZERO;
   
   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
   ];

   const result = ExtractLevelsFromTorpor(1, torpor, IA.ONE, imprint, multipliers, false)

   expect(result).toEqual([[1,0]])
})

test('ExtractLevels() works with a wild level of 50', () => {
   let torpor = new IA(149);
   let imprint = IA.ZERO;
   
   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
   ];

   const result = ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, multipliers, false)

   expect(result).toEqual([[50,0]])
})

test('ExtractLevels() works with a tamed level of 50 with Ta', () => {
   let torpor = new IA(149.5);
   let imprint = IA.ZERO;
   
   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      new IA(0.5),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ONE,
      IA.ZERO,
      IA.ZERO,
   ];

   const result = ExtractLevelsFromTorpor(50, torpor, IA.ONE, imprint, multipliers, false)

   expect(result).toEqual([[50,0]])
})

test('ExtractLevels() works with a tamed level of 75 with Ta and has 25 domestic levels', () => {
   let torpor = new IA(149.5);
   let imprint = IA.ZERO;
   
   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      new IA(0.5),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ONE,
      IA.ZERO,
      IA.ZERO,
   ];

   const result = ExtractLevelsFromTorpor(75, torpor, IA.ONE, imprint, multipliers, false)

   expect(result).toEqual([[50,25]])
})

test('ExtractLevels() throws exception when Torpor can be leveled', () => {
   let torpor = new IA(100);
   let imprint = IA.ZERO;

   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
   ];

   expect(() => ExtractLevelsFromTorpor(1, torpor, IA.ONE, imprint, multipliers, true)).toThrow(Error);
})

test('ExtractLevels() throws exception when Torpor has a Tm', () => {
   let torpor = new IA(100);
   let imprint = IA.ZERO;

   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ONE,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
   ];

   expect(() => ExtractLevelsFromTorpor(1, torpor, IA.ONE, imprint, multipliers, true)).toThrow(Error);
})

test('ExtractLevels() throws exception when Torpor increase per level is IA.ZERO', () => {
   let torpor = new IA(100);
   let imprint = IA.ZERO;

   let multipliers = [
      new IA(100),
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ONE,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
      IA.ZERO,
   ];

   expect(() => ExtractLevelsFromTorpor(1, torpor, IA.ZERO, imprint, multipliers, true)).toThrow(Error);
})