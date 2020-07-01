import { Server } from './server'

test('default Server() is valid', () => {
   let testServer: Server = new Server();

   expect(testServer).toHaveProperty('singleplayer');
   expect(testServer.singleplayer).toBe(false);
})