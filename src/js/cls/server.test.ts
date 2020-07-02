import { Server } from './server';

test('default Server() is valid', () => {
    const testServer = new Server();

    expect(testServer).toHaveProperty('singleplayer');
    expect(testServer.singleplayer).toBe(false);
});
