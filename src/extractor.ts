import IA, { Interval } from 'interval-arithmetic';
import { intFromRange, CombineAllMults } from './utils';
import { Multipliers } from './mults';
import { Server } from './server';
import { GetPresetData } from './data';
import { Creature } from './creature';
import { Species } from './species';
import { STAT_COUNT } from './consts';

export function Extract(creature: Creature, server: Server, species: Species) {
    // Format creature values
    const serverMults = CalculateServerMults(server);
    const mults = CombineAllMults(species.stats, serverMults);
    const m = AdjustMultipliers(mults, creature.isWild, creature.isTamed);
    AdjustRanges(creature.isWild, creature.isTamed, creature.isBred, creature.imprint);
    // ExtractLevelsFromTorpor();
}

/**
 * Multiplies the server multipliers by the singleplayer multipliers if the server is a singleplayer server
 *
 * @param server
 *
 * @returns A copy of the multipliers, multiplied by singleplayer multipliers if applicable
 */
export function CalculateServerMults(server: Server): number[][] {
    if (!server.singleplayer) return server.multipliers;

    const output = new Server(server);
    const spMults = GetPresetData().servers.singleplayer;

    for (let stat = 0; stat < server.multipliers.length; stat++) {
        for (let i = 0; i < server.multipliers[stat].length; i++) {
            output.multipliers[stat][i] = server.multipliers[stat][i] * spMults[stat][i];
        }
    }

    return output.multipliers;
}

/**
 * Zeros out the Tamed and/or Bred multipliers if the calculation wouldn't use them
 *
 * @param multipliers
 * @param isWild
 * @param isTamed
 *
 * @returns A copy of the multipliers after they have been adjusted
 */
export function AdjustMultipliers(multipliers: Multipliers[], isWild: boolean, isTamed: boolean): Multipliers[] {
    const output: Multipliers[] = [];
    for (let stat = 0; stat < STAT_COUNT; stat++) {
        const m: Multipliers = multipliers[stat];
        let statMults: Multipliers;
        if (isWild) {
            statMults = new Multipliers([m.B, m.Iw, IA.ZERO, IA.ZERO, IA.ZERO, IA.ZERO]);
        } else if (isTamed) {
            statMults = new Multipliers([m.B, m.Iw, m.Id, m.Ta, m.Tm, IA.ZERO]);
        } else {
            statMults = m;
        }
        output.push(new Multipliers(statMults));
    }

    return output;
}

export function AdjustRanges(isWild: boolean, isTamed: boolean, isBred: boolean, imp: number): [Interval, Interval] {
    let TE: Interval;
    let imprint: Interval;

    if (isWild) {
        TE = IA.ZERO;
        imprint = IA.ZERO;
    } else if (isTamed) {
        TE = IA(0, 1);
        imprint = IA.ZERO;
    } else if (isBred) {
        TE = IA.ONE;
        imprint = IA(imp - 0.005, imp + 0.005); // TODO: Convert to a proper Interval range function
    }

    return [TE, imprint];
}

// Extract creature base & domestic levels
//  Inputs:
//      Creature level
//      Creature is wild/tamed/bred
//      Creature's Torpor value
//      Creature's Imprint range

//      Species' Torpor values

//      Server's Torpor multipliers
//      Server's Imprint bonus multiplier
//  Outputs:
//      On success:
//          Array of 1 or more [Base Level, Domestic Levels, Valid Imprint Range]
//      On failure:
//          Empty Array
//  Description:
//      Calculate possible level range based on Imprint value
//      Reverse torpor calculation
//      Output is base level (wild levels from torpor + 1) & domestic level (level - base level)
//      Multiple outputs may be possible due to Imprint value range

// Stat Value Calculation:
//  Iw = Iw * (Iw > 0) ? IwM : 1
//  Id = Id * (Id > 0) ? IdM : 1
//  Ta = Ta * (Ta > 0) ? TaM : 1
//  Tm = Tm * (Tm > 0) ? TmM : 1
//  Ib = Ib * (Ib > 0) ? IbM : 1

//  TBHM = (statIndex != HEALTH || isWild) ? 1 : TBHM
//  Imp = (isBred) ? IA(Imp - 0.5%, Imp + 0.5%) : 0
//  TE = (isWild) ? 0 : (isBred) : 1 : IA(0, 1)
//  Lw = IA(0, Level - 1)
//  Ld = IA(Level - Lw, Level - 1)

//  V = (B * (1 + Lw * Iw) * TBHM * (1 + Imp * Ib) + Ta) * (1 + TE * Tm) * (1 + Ld * Id)

// Torpor Stat Value Calculation:
//  (B * (1 + baseLevel * torporInc) * (1 + Imp * Ib * IbM) + Ta * TaM) * (1 + TE * Tm * TmM) * (1 + Ld * Id * IdM)

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
    if (!IA.equal(m.Tm, IA.ZERO)) throw new Error('Torpor having a TameMultiplier is unsupported at this time.');
    if (IA.equal(torporInc, IA.ZERO)) throw new Error('Torpor cannot be calculated for this species');

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
