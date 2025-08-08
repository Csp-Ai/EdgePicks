import { statCruncher } from '../../lib/agents/statCruncher';
import type { Matchup } from '../../lib/types';
import stats from './fixtures/stats.json';

jest.mock('../../lib/data/stats', () => ({
  fetchStats: jest.fn(async () => stats),
}));

describe('statCruncher agent', () => {
  it('computes efficiency edge from stats', async () => {
    const matchup: Matchup = {
      homeTeam: 'A',
      awayTeam: 'B',
      league: 'NFL',
      time: '2024-01-01',
    } as any;
    const result = await statCruncher(matchup);
    expect(result.team).toBe('A');
    expect(result.score).toBeCloseTo(0.55, 5);
    expect(result.reason).toContain('10% efficiency edge');
  });
});
