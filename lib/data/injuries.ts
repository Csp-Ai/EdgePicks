import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';

const InjurySchema = z.object({
  team: z.string(),
  player: z.string(),
  status: z.string().optional(),
});

export type Injury = z.infer<typeof InjurySchema>;

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

export async function fetchInjuries(_league: League): Promise<Injury[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  // Placeholder API - replace with real injury endpoint when available
  const url = 'https://example.com/injuries';
  const res = await fetchWithRetry(url);
  if (res.status === 429) {
    throw new Error('INJURY_API_RATE_LIMIT');
  }
  const data = z.array(InjurySchema).parse(await res.json());
  return data;
}
