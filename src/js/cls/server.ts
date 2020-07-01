import { presetData } from './data'

export class Server {
   singleplayer: boolean = false;
   imprint: number = 1;
   multipliers: number[][] = presetData.servers.official;

   // private _official: number[][] = presetData.servers.official;
   // private _sp_multipliers: number[][] = presetData.servers.singleplayer;

   // get official() {
   //    return this._official;
   // }

   // get sp_multipliers() {
   //    return this._sp_multipliers;
   // }
}