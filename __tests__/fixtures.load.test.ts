import { loadFixture } from '@/lib/fixtures/load';

describe('loadFixture', () => {
  interface UpcomingGame { gameId: string }

  it('loads fixtures as typed objects', async () => {
    const data = await loadFixture<UpcomingGame[]>('demo/upcoming');
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].gameId).toBe('demo1');
  });

  it('blocks traversal outside fixtures directory', async () => {
    await expect(loadFixture('../package.json')).rejects.toThrow();
  });
});
