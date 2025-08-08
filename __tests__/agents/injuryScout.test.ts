import { injuryScout } from '../../lib/agents/injuryScout';
import type { Matchup } from '../../lib/types';
import injuries from './fixtures/injuries.json';

jest.mock('../../lib/data/injuries', () => ({
  fetchInjuries: jest.fn(async () => injuries),
}));

describe('injuryScout agent', () => {
  it('favors team with fewer injuries', async () => {
    const matchup: Matchup = {
      homeTeam: 'A',
      awayTeam: 'B',
      league: 'NFL',
      time: '2024-01-01',
    } as any;
    const result = await injuryScout(matchup);
    expect(result.team).toBe('B');
    expect(result.score).toBeCloseTo(0.6, 5);
    expect(result.reason).toContain('1 more key injuries');
  });
});
