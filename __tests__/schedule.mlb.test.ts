import rawSchedule from './fixtures/mlb.schedule.json';
import { normalizeMlbSchedule } from '../lib/data/schedule.mlb';

describe('MLB schedule provider', () => {
  it('normalizes MLB API data to internal Matchup', () => {
    const result = normalizeMlbSchedule(rawSchedule);
    expect(result).toEqual([
      {
        homeTeam: 'New York Yankees',
        awayTeam: 'Boston Red Sox',
        time: '2024-04-01T17:05:00Z',
        league: 'MLB',
        gameId: 'mlb1',
        source: 'live-mlb-api',
      },
      {
        homeTeam: 'Los Angeles Dodgers',
        awayTeam: 'Chicago Cubs',
        time: '2024-04-02T20:10:00Z',
        league: 'MLB',
        gameId: 'mlb2',
        source: 'live-mlb-api',
      },
    ]);
  });
});
