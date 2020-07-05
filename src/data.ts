import { GetGlobalData, PresetData } from './utils';

const presetData = GetGlobalData();

export function GetPresetData(): PresetData {
    if (presetData) return presetData;
    else throw new Error('presetData is not available');
}
