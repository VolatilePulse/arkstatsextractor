export class Species {
    blueprint: string;
    name: string;
    stats: number[][];
    torporIncrease: number;
    dontUse: boolean[] = Array(12).fill(false);
    canLevel: boolean[] = Array(12).fill(true);
    imprintMultiplier: number[];
    displayedStats: boolean[] = [];
    tbhm: number;
    teMultiplier: number; // MaxTamingEffectivenessBaseLevelMultiplier
}
