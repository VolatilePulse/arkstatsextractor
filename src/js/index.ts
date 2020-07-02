import { Server } from './cls/server';
import { Creature } from './cls/creature';
import { GatherData } from '../utils/utils';

const presetData = GatherData();

const inputServer = new Server(presetData.servers.official);
console.log(inputServer);
const inputCreature = new Creature(presetData.species[400]);
console.log(inputCreature);

console.log(presetData.species[400]);
