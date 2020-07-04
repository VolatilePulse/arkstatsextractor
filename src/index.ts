import { Server } from './server';
import { Creature } from './creature';
import { GatherData } from './utils';

const presetData = GatherData();

const inputServer = new Server(presetData.servers.official);
console.log(inputServer);
const inputCreature = new Creature(presetData.species[400]);
console.log(inputCreature);

console.log(presetData.species[400]);
