import { Server } from './server';
import { GatherData } from './utils';

test('default Server() is valid', () => {
    const testServer = new Server(GatherData().servers.official);

    expect(testServer).toHaveProperty('singleplayer');
    expect(testServer.singleplayer).toBe(false);
});
