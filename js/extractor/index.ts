import { Server } from './cls/server.js';
import { presetData } from './cls/data.js';
import { Creature } from './cls/creature.js';

let inputServer = new Server();
// console.log(inputServer);
let inputCreature = new Creature(presetData.species[400]);
// console.log(inputCreature);

console.log(presetData.species[400]);