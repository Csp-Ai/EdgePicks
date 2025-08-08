import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';

const TeamStatSchema = z.object({
  team: z.string(),
  efficiency: z.number(),
});

export type TeamStat = z.infer<typeof TeamStatSchema>;

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

export async function fetchStats(_league: League): Promise<TeamStat[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  // Placeholder API - replace with real stats endpoint when available
  const url = 'https://example.com/stats';
  const res = await fetchWithRetry(url);
  if (res.status === 429) {
    throw new Error('STATS_API_RATE_LIMIT');
  }
  const data = z.array(TeamStatSchema).parse(await res.json());
  return data;
}
