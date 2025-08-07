/** @jest-environment node */

describe('LIVE_MODE switch', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('serves mock data when off', async () => {
    process.env.LIVE_MODE = 'off';
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { fetchNflGames } = await import('../lib/data/liveSports');
    const games = await fetchNflGames();
    expect(games.length).toBeGreaterThan(0);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('fetches remote when on', async () => {
    process.env.LIVE_MODE = 'on';
    process.env.SPORTS_DB_NFL_ID = '123';
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => ({ events: [] }) } as any);
    const { fetchNflGames } = await import('../lib/data/liveSports');
    await fetchNflGames();
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
