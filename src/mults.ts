import IA, { Interval } from 'interval-arithmetic';

export class Multipliers {
    B: Interval;
    Iw: Interval;
    Id: Interval;
    Ta: Interval;
    Tm: Interval;
    Ib: Interval;

    constructor(m: Interval[]) {
        this.B = m[0];
        this.Iw = IA.mul(m[1], m[6]);
        this.Id = IA.mul(m[2], m[7]);
        this.Ta = IA.mul(m[3], m[8]);
        this.Tm = IA.mul(m[4], m[9]);
        this.Ib = IA.mul(m[5], m[10]);
    }
}
