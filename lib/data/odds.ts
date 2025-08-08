import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';

const ODDS_API_SPORT_MAP: Record<League, string> = {
  NFL: 'americanfootball_nfl',
  MLB: 'baseball_mlb',
  NBA: 'basketball_nba',
  NHL: 'icehockey_nhl',
};

const OutcomeSchema = z.object({
  name: z.string(),
  price: z.number().optional(),
  point: z.number().optional(),
});

const MarketSchema = z.object({
  key: z.string(),
  outcomes: z.array(OutcomeSchema),
});

const BookmakerSchema = z.object({
  title: z.string(),
  last_update: z.string(),
  markets: z.array(MarketSchema),
});

const OddsGameSchema = z.object({
  home_team: z.string(),
  away_team: z.string(),
  bookmakers: z.array(BookmakerSchema),
});

export type OddsGame = z.infer<typeof OddsGameSchema>;

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

export async function fetchOdds(league: League): Promise<OddsGame[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  const sport = ODDS_API_SPORT_MAP[league];
  const apiKey = ENV.ODDS_API_KEY;
  if (!sport || !apiKey) return [];
  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=h2h,spreads,totals&apiKey=${apiKey}`;
  const res = await fetchWithRetry(url);
  if (res.status === 429) {
    throw new Error('ODDS_API_RATE_LIMIT');
  }
  const data = z.array(OddsGameSchema).parse(await res.json());
  return data;
}
