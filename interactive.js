/* eslint-disable */

const IA = require('interval-arithmetic').Interval;
const extractor = require('./public/js/extractor');
const ExtractLevelsFromTorpor = require('./public/js/extractor').ExtractLevelsFromTorpor;
const CombineMultipliers = require('./public/js/utils').CombineMultipliers;

const speciesTorpor = [100, 0, 0, 0, 0, 0];
const serverTorpor = [0, 0, 0, 0, 0];
const mults = CombineMultipliers(speciesTorpor, serverTorpor);

const torpor = IA(100);
const imprint = IA.ZERO;
const m = mults;

// const util = require('./public/js/utils');
