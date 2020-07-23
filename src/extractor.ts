import IA, { Interval } from 'interval-arithmetic';
import { IntFromRange } from './utils';
import { CombineAllMults } from './ark';
import { Multipliers } from './mults';
import { Server } from './server';
import { GetPresetData } from './data';
import { Creature } from './creature';
import { Species } from './species';
import { STAT_COUNT, TORPOR } from './consts';

/**
 * Performs a stat extraction for a creature.
 *
 * @param {Creature} c
 * @param {Server} svr
 * @param {Species} spc
 * @param {boolean} fromExport
 *
 * @returns An array of stat possbilities for this species
 */
export function Extract(c: Creature, svr: Server, spc: Species, fromExport = false) {
    // Format creature values
    const stats = ConvertCreatureValuesToRanges(c.statusValues, fromExport);
    const values = PrepareValues(stats, fromExport);
    const serverMults = CalculateServerMults(svr);
    const mults = CombineAllMults(spc.stats, serverMults);
    const m = AdjustMultipliers(mults, c.isWild, c.isTamed);
    const [TE, imprint] = AdjustRanges(c.isWild, c.isTamed, c.isBred, c.imprint);
    const levels = ExtractLevelsFromTorpor(c.level, values[TORPOR], IA(spc.torporIncrease), imprint, m[TORPOR]);

    // ...
}

/**
 * Convert creature input floats to Intervals to account for floating point inaccuracy.
 *
 * @param {number[]} values
 * @param {boolean} fromExport
 *
 * @returns {Interval[]} An Interval array of the creature stat values
 */
export function ConvertCreatureValuesToRanges(values: number[], fromExport: boolean): Interval[] {
    const retArray: Interval[] = [];
    for (const v of values) {
        retArray.push(IA(v));
    }
    return retArray;
}

/**
 * Adds IA.ONE to all percent stats and clears all unused stats
 *
 * @param {Interval[]} stats
 * @param {boolean} fromExport
 *
 * @returns An array of the Stat value intervals with unused stats set to IA.Empty()
 */
export function PrepareValues(stats: Interval[], fromExport: boolean): Interval[] {
    if (fromExport) {
    }
    return [];
}

/**
 * Multiplies the server multipliers by the singleplayer multipliers if the server is a singleplayer server
 *
 * @param {Server} server
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
 * Zeros out the Tamed and/or Bred multipliers if the extractor wouldn't use them.
 *
 * @param {Multipliers[]} multipliers
 * @param {boolean} isWild
 * @param {boolean} isTamed
 *
 * @returns A copy of the multipliers after they have been adjusted.
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

/**
 * Converts the imprint value to a range, and creates a Taming Effectiveness range based on extraction type.
 *
 * @param {boolean} isWild
 * @param {boolean} isTamed
 * @param {boolean} isBred
 * @param {number} imp
 *
 * @return {[Interval, Interval]} A tuple of the TE and Imprint Ranges.
 */
export function AdjustRanges(isWild: boolean, isTamed: boolean, isBred: boolean, imp: number): [Interval, Interval] {
    if (isWild) {
        return [IA.ZERO, IA.ZERO];
    }
    if (isTamed) {
        return [IA(0, 1), IA.ZERO];
    }
    return [IA.ONE, IA(imp - 0.005, imp + 0.005)]; // TODO: Convert to a proper Interval range function
}

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

/**
 * Use Torpor and current Creature level to calculate base and domestic level possibilities.
 * @param {number} level
 * @param {Interval} torpor
 * @param {number} torporInc
 * @param {Interval} imprint
 * @param {Multipliers} m
 *
 * @throws {Error} If Torpor can be leveled
 * @throws {Error} If Torpor is affected by Taming Effectiveness
 * @throws {Error} If torporInc is 0
 *
 * @returns {[number, number][]} All possible combinations of base and domestic level possibilities.
 * An empty array is returned if no combinations were found.
 */
export function ExtractLevelsFromTorpor(
    level: number,
    torpor: Interval,
    torporInc: Interval,
    imprint: Interval,
    m: Multipliers,
): Array<[number, number]> {
    if (!IA.equal(m.Id, IA.ZERO)) throw new Error('Torpor being leveled is unsupported at this time.');
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
    currentTorpor = IA.div(IA.sub(currentTorpor, IA.ONE), IA(torporInc));

    // Calculate Base Level from remaining Torpor value
    const baseLevel = IA.add(currentTorpor, IA.ONE);
    const retArray: Array<[number, number]> = [];

    // Create an Array based on possible Base Levels
    for (const bl of IntFromRange(baseLevel)) retArray.push([bl, level - bl]);

    // Ensure no calculated levels are negative
    return retArray.filter(([Lw, Ld]) => Lw >= 0 && Ld >= 0);
}
