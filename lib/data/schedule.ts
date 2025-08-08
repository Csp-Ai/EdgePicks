import { z } from 'zod';
import { ENV } from '../env';
import mockUpcoming from '../../mock/upcoming-games.json';
import type { Matchup } from '../types';

export type League = 'NFL' | 'MLB' | 'NBA' | 'NHL';

const SPORTS_DB_LEAGUE_IDS: Record<League, string | undefined> = {
  NFL: ENV.SPORTS_DB_NFL_ID,
  MLB: ENV.SPORTS_DB_MLB_ID,
  NBA: ENV.SPORTS_DB_NBA_ID,
  NHL: ENV.SPORTS_DB_NHL_ID,
};

const EventSchema = z.object({
  idEvent: z.string().optional(),
  strHomeTeam: z.string().nullable(),
  strAwayTeam: z.string().nullable(),
  dateEvent: z.string().nullable(),
  strTime: z.string().nullable(),
});

const EventsResponseSchema = z.object({
  events: z.array(EventSchema).nullish(),
});

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  backoff = 500
): Promise<Response> {
  let res: Response = await fetch(url, options);
  for (let attempt = 0; attempt < retries && res.status === 429; attempt++) {
    await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
    res = await fetch(url, options);
  }
  return res;
}

export async function fetchSchedule(league: League): Promise<Matchup[]> {
  if (ENV.LIVE_MODE !== 'on') {
    return (mockUpcoming as Matchup[]).filter((g) => g.league === league);
  }
  const leagueId = SPORTS_DB_LEAGUE_IDS[league];
  if (!leagueId) return [];
  const url = `https://www.thesportsdb.com/api/v1/json/${ENV.SPORTS_API_KEY}/eventsnextleague.php?id=${leagueId}`;
  const res = await fetchWithRetry(url);
  if (res.status === 429) {
    throw new Error('SPORTS_DB_RATE_LIMIT');
  }
  const json = EventsResponseSchema.parse(await res.json());
  const events = json.events ?? [];
  return events.map((e) => ({
    homeTeam: e.strHomeTeam ?? '',
    awayTeam: e.strAwayTeam ?? '',
    time: e.dateEvent && e.strTime ? `${e.dateEvent} ${e.strTime}` : e.dateEvent || '',
    league,
    gameId: e.idEvent,
    source: `live-${league.toLowerCase()}-api`,
  })) as Matchup[];
}

export const fetchNflSchedule = () => fetchSchedule('NFL');
export const fetchMlbSchedule = () => fetchSchedule('MLB');
export const fetchNbaSchedule = () => fetchSchedule('NBA');
export const fetchNhlSchedule = () => fetchSchedule('NHL');
