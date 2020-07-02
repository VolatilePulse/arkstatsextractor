import { Server } from './cls/server';
import { presetData } from './cls/data';
import { Creature } from './cls/creature';

const inputServer = new Server();
console.log(inputServer);
const inputCreature = new Creature(presetData.species[400]);
console.log(inputCreature);

console.log(presetData.species[400]);
