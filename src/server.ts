import { GetPresetData } from './data';

export class Server {
    singleplayer = false;
    imprint = 1;
    multipliers: number[][];

    constructor(server: number[][] | Server) {
        if (server instanceof Server) {
            this.singleplayer = server.singleplayer;
            this.imprint = server.imprint;
        }

        const serverMults = server instanceof Server ? server.multipliers : server;
        const statCount = serverMults.length;
        const multsCount = serverMults[0].length;

        this.multipliers = [];
        for (let stat = 0; stat < statCount; stat++) {
            const stats: number[] = [];
            const serverStat = serverMults[stat];

            this.multipliers.push(stats);
            for (let i = 0; i < multsCount; i++) {
                stats.push(serverStat[i]);
            }
        }
    }

    static FromOfficial(): Server {
        const server = new Server(GetPresetData().servers.official);
        server.singleplayer = false;
        server.imprint = 1;
        return server;
    }
}
