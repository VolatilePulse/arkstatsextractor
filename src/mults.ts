import IA, { Interval } from 'interval-arithmetic';
import { B, IW, ID, TA, TM, IB, IWM, IDM, TAM, TMM, IBM } from './consts';

export class Multipliers {
    readonly B: Interval;
    readonly Iw: Interval;
    readonly Id: Interval;
    readonly Ta: Interval;
    readonly Tm: Interval;
    readonly Ib: Interval;

    constructor(m: Interval[] | Multipliers) {
        if (m instanceof Multipliers) {
            this.B = m.B;
            this.Iw = m.Iw;
            this.Id = m.Id;
            this.Ta = m.Ta;
            this.Tm = m.Tm;
            this.Ib = m.Ib;
        } else {
            this.B = m[B];
            this.Iw = IA.mul(m[IW], m[IWM]);
            this.Id = IA.mul(m[ID], m[IDM]);
            this.Ta = IA.mul(m[TA], m[TAM]);
            this.Tm = IA.mul(m[TM], m[TMM]);
            this.Ib = IA.mul(m[IB], m[IBM]);
        }
    }
}
