import { Matchup } from '../types';

export function getFallbackMatchups(): (Matchup & { useFallback: true })[] {
  return [
    {
      homeTeam: 'Dallas Cowboys',
      awayTeam: 'New York Giants',
      time: '2025-09-07T20:20:00Z',
      league: 'NFL',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
      useFallback: true,
      source: 'fallback',
    },
  ];
}
