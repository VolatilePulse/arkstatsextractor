import IA, {Interval} from 'interval-arithmetic';
import { intFromRange } from './utils'

// # Extract creature base & domestic levels
// ## Inputs:
//    Creature level 
//    Creature is wild/tamed/bred
//    Creature's Torpor value
//    Creature's Imprint range

//    Species' Torpor values

//    Server's Torpor multipliers
//    Server's Imprint bonus multiplier
// ## Outputs:
//    On success:
//       Array of 1 or more [Base Level, Domestic Levels, Valid Imprint Range]
//    On failure:
//       Empty Array
// ## Description:
//    Calculate possible level range based on Imprint value
//    Reverse torpor calculation
//    Output is base level (wild levels from torpor + 1) & domestic level (level - base level)
//    Multiple outputs may be possible due to Imprint value range

// wildTamedBred = 1: wild, 2: tamed, 3: bred
// multipliers = [B, Iw, Id, Ta, Tm, IwM, IdM, TaM, TmM, IBM]

// Extract creature base & domestic levels
export function ExtractLevelsFromTorpor(level: number, torpor: Interval, torporInc: Interval, imprint: Interval, multipliers: Interval[], canLevel: boolean): Array<[number, number]> {
   if (canLevel) throw new Error("Torpor being leveled is unsupported at this time.");
   if (multipliers[4] != IA.ZERO) throw new Error('Torpor having a TameMultiplier is unsupported at this time.');
   if (torporInc == IA.ZERO) throw new Error('Torpor cannot be calculated for this species')

   // Remove Ta from Torpor
   let currentTorpor = IA.sub(torpor, IA.mul(multipliers[3], multipliers[7]));

   // Remove B from Torpor
   currentTorpor = IA.sub(currentTorpor, multipliers[0]);

   // Calculate Base Level from remaining Torpor value
   const baseLevel = IA.add(IA.div(currentTorpor, torporInc), IA.ONE);
   const retArray: Array<[number, number]> = [];

   // Create an Array based on possible Base Levels
   for (const bl of intFromRange(baseLevel))
      retArray.push([bl, level - bl])

   return retArray;
}