import { servers } from "../../../api/servers.js";
import { stats } from "../../../api/stats.js";

export class Servers {
   official: number[][];
   singleplayer: number[][];
}

export class Species {
   blueprint: string;
   name: string;
   stats: number[][];
   torporIncrease: number;
   dontUse: boolean[] = Array(12).fill(false);
   canLevel: boolean[] = Array(12).fill(true);
   imprintMultiplier: number[];
   displayedStats: boolean[] = [];
   tbhm: number = 1;
   teMultiplier: number = 0.5 // MaxTamingEffectivenessBaseLevelMultiplier

   constructor(format: string, s: any) {
      switch(format) {
         case "1.13":
            this.blueprint = s.blueprintPath;
            this.name = s.name;
            this.stats = s.fullStatsRaw;
            this.torporIncrease = this.stats[2][1];
            this.stats[2][1] = 0;
            this.tbhm = s.TamedBaseHealthMultiplier;

            for (let i = 0; i < this.stats.length; i ++) {
               this.displayedStats.push(!!(s.displayedStats & 1<<i));

               if (this.stats[i] == null)
                  this.stats[i] = [0, 0, 0, 0, 0];
               if (this.stats[i][2] == 0) {
                  this.canLevel[i] = false;

                  if (this.stats[i][1] == 0)
                     this.dontUse[i] = true;
               }
            }

            if (s.statImprintMult)
               this.imprintMultiplier = s.statImprintMult;
            else
               this.imprintMultiplier = [ 0.2, 0, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0.2, 0, 0 ];
      }

      return this;
   }
}

class Data {
   servers: Servers = new Servers();
   species: Species[] = [];

   constructor() {
      this.servers.official = servers.official;
      this.servers.singleplayer = servers.singleplayer;
      for (let s of stats.species) {
         this.species.push(new Species(stats.format, s));
      }
   }
}
export const presetData = new Data();