import { Server } from './cls/server';
import { presetData } from './cls/data';
import { Creature } from './cls/creature';

let inputServer = new Server();
// console.log(inputServer);
let inputCreature = new Creature(presetData.species[400]);
// console.log(inputCreature);

console.log(presetData.species[400]);