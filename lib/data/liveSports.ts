import { Matchup } from '../types';

export async function fetchUpcomingGames(): Promise<Matchup[]> {
  return [
    { homeTeam: 'DAL', awayTeam: 'PHI', matchDay: 1, time: 'Aug 10, 6:30PM', league: 'NFL' },
    { homeTeam: 'LAL', awayTeam: 'GSW', matchDay: 1, time: 'Aug 10, 8:00PM', league: 'NBA' }
  ];
}

