import { Server } from '../server';

test('default Server is valid', () => {
    const testServer = Server.FromOfficial();

    expect(testServer).toHaveProperty('singleplayer');
    expect(testServer.singleplayer).toBe(false);
});

test("Server copy doesn't reference the original", () => {
    const official = Server.FromOfficial();
    const copy = new Server(official);

    expect(official.multipliers).not.toBe(copy.multipliers);
    expect(official.multipliers[0]).not.toBe(copy.multipliers[0]);
});

test('Server copies data correctly', () => {
    const official = Server.FromOfficial();
    const copy = new Server(official);

    expect(official.singleplayer).toEqual(copy.singleplayer);
    expect(official.imprint).toEqual(copy.imprint);
    expect(official.multipliers).toEqual(copy.multipliers);
});
