import { lineWatcher } from '../../lib/agents/lineWatcher';
import type { Matchup } from '../../lib/types';
import odds from './fixtures/odds.json';

jest.mock('../../lib/data/odds', () => ({
  fetchOdds: jest.fn(async () => odds),
}));

describe('lineWatcher agent', () => {
  it('uses adapter odds when matchup lacks them', async () => {
    const matchup: Matchup = {
      homeTeam: 'A',
      awayTeam: 'B',
      league: 'NFL',
      time: '2024-01-01',
    } as any;
    const result = await lineWatcher(matchup);
    expect(result.team).toBe('A');
    expect(result.score).toBeCloseTo(0.65, 5);
    expect(result.reason).toContain('Spread -3');
  });
});
