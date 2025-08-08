import { createFuzzySearch } from '../lib/search/fuzzy';
import type { Game } from '../lib/types';

describe('createFuzzySearch', () => {
  const games: Game[] = [
    {
      gameId: '1',
      league: 'NBA',
      homeTeam: 'Lakers',
      awayTeam: 'Celtics',
      time: new Date().toISOString(),
    },
    {
      gameId: '2',
      league: 'NBA',
      homeTeam: 'Bulls',
      awayTeam: 'Heat',
      time: new Date().toISOString(),
    },
  ];

  it('matches even with typos', () => {
    const search = createFuzzySearch(games, { keys: ['homeTeam', 'awayTeam'] });
    const res = search('lkr');
    expect(res[0].homeTeam).toBe('Lakers');
  });

  it('returns empty when no match', () => {
    const search = createFuzzySearch(games, { keys: ['homeTeam', 'awayTeam'] });
    const res = search('xyz');
    expect(res).toHaveLength(0);
  });
});
