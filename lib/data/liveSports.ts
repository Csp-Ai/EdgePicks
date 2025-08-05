import { Matchup } from '../types';

// Temporary hard-coded upcoming games. Replace with real sports API integration
// (e.g., SportsDB, ESPN, etc.) when available.
const sampleGames: Matchup[] = [
  {
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    time: '2024-10-16T02:00:00Z',
    league: 'NBA',
  },
  {
    homeTeam: 'Yankees',
    awayTeam: 'Red Sox',
    time: '2024-07-04T23:00:00Z',
    league: 'MLB',
  },
  {
    homeTeam: 'Cowboys',
    awayTeam: 'Eagles',
    time: '2024-09-15T17:00:00Z',
    league: 'NFL',
  },
];

export async function fetchUpcomingGames(): Promise<Matchup[]> {
  // TODO: Replace with real API call.
  return sampleGames;
}
