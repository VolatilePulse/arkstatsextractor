import { Server } from './server';
import { Creature } from './creature';
import { GetPresetData } from './data';

const presetData = GetPresetData();

const inputServer = new Server(presetData.servers.official);
console.log(inputServer);
const inputCreature = new Creature(presetData.species[400]);
console.log(inputCreature);

console.log(presetData.species[400]);
