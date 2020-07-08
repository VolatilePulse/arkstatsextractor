import * as defaultServers from './api/servers';
import { CreateSpecies } from './ark';
import { stats } from './api/stats';
import { Species } from './species';

const presetData = GetGlobalData();

export interface PresetData {
    servers: { official: number[][]; singleplayer: number[][] };
    species: Species[];
}

function GetGlobalData(): PresetData {
    const servers = defaultServers.servers;
    const species: Species[] = [];

    for (const s of stats.species) species.push(CreateSpecies(s));

    return { servers, species };
}

export function GetPresetData(): PresetData {
    if (presetData) return presetData;
    else throw new Error('presetData is not available');
}
