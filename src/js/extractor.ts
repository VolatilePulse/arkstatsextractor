import IA, { Interval } from 'interval-arithmetic';
import { intFromRange } from '../utils/utils';
import { Multipliers } from './cls/mults';

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

// Torpor Stat Value Calculation:
//    (B * (1 + baseLevel * torporInc) * (1 + Imp * Ib * IbM) + Ta * TaM) * (1 + TE * Tm * TmM) * (1 + Ld * Id * IdM)

// Extract creature base & domestic levels
export function ExtractLevelsFromTorpor(
    level: number,
    torpor: Interval,
    torporInc: Interval,
    imprint: Interval,
    m: Multipliers,
    canLevel: boolean,
): Array<[number, number]> {
    if (canLevel) throw new Error('Torpor being leveled is unsupported at this time.');
    if (IA.notEqual(m.Tm, IA.ZERO)) throw new Error('Torpor having a TameMultiplier is unsupported at this time.');
    if (torporInc == IA.ZERO) throw new Error('Torpor cannot be calculated for this species');

    // V = (B * (1 + baseLevel * torporInc) * (1 + Imp * IB * IBM) + Ta * TaM)
    // Remove Ta from Torpor
    let currentTorpor = IA.sub(torpor, m.Ta);

    // V = B * (1 + baseLevel * torporInc) * (1 + Imp * IB * IBM)
    // Remove B from Torpor
    currentTorpor = IA.div(currentTorpor, m.B);

    // V = (1 + baseLevel * torporInc) * (1 + Imp * IB * IBM)
    // Remove Imp from Torpor
    currentTorpor = IA.div(currentTorpor, IA.add(IA.ONE, IA.mul(imprint, m.Ib)));

    // V = (1 + baseLevel * torporInc)
    // Isolate baseLevel
    currentTorpor = IA.div(IA.sub(currentTorpor, IA.ONE), torporInc);

    // Calculate Base Level from remaining Torpor value
    const baseLevel = IA.add(currentTorpor, IA.ONE);
    const retArray: Array<[number, number]> = [];

    // Create an Array based on possible Base Levels
    for (const bl of intFromRange(baseLevel)) retArray.push([bl, level - bl]);

    // Ensure no calculated levels are negative
    return retArray.filter(([Lw, Ld]) => Lw >= 0 && Ld >= 0);
}
