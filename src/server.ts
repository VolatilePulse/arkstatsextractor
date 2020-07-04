export class Server {
    singleplayer = false;
    imprint = 1;
    multipliers: number[][];

    constructor(server: number[][]) {
        this.multipliers = server;
    }
}
