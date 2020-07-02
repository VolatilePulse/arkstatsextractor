/* eslint-disable */

const IA = require('interval-arithmetic').Interval;
const extractor = require('./public/js/extractor');
const util = require('./public/js/utils');

// V = (B * (1 + Lw * Iw * IwM) * (1 + Imp * Ib * IbM) + Ta * TaM) * (1 + TE * Tm * TmM) * (1 + Ld * Id * IdM)

let value = IA.add(
    IA.mul(
        IA.mul(multipliers[0], IA.add(IA.ONE, IA.mul(new IA(195), new IA(0.0001)))),
        IA.add(IA.ONE, IA.mul(new IA(0.995, 1), IA.mul(multipliers[5], multipliers[10]))),
    ),
    IA.mul(multipliers[3], multipliers[8]),
);
