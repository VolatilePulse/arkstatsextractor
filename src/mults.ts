import IA, { Interval } from 'interval-arithmetic';
import { B, IW, ID, TA, TM, IB, IWM, IDM, TAM, TMM, IBM } from './consts';

export class Multipliers {
    B: Interval;
    Iw: Interval;
    Id: Interval;
    Ta: Interval;
    Tm: Interval;
    Ib: Interval;

    constructor(m: Interval[]) {
        this.B = m[B];
        this.Iw = IA.mul(m[IW], m[IWM]);
        this.Id = IA.mul(m[ID], m[IDM]);
        this.Ta = IA.mul(m[TA], m[TAM]);
        this.Tm = IA.mul(m[TM], m[TMM]);
        this.Ib = IA.mul(m[IB], m[IBM]);
    }
}
