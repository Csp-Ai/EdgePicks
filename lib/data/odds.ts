import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';
import { getCacheDriver } from '../infra/cache';
import { logAdapterMetric } from '../analytics/logUiEvent';

const ODDS_API_SPORT_MAP: Record<League, string> = {
  NFL: 'americanfootball_nfl',
  MLB: 'baseball_mlb',
  NBA: 'basketball_nba',
  NHL: 'icehockey_nhl',
};

const OutcomeSchema = z
  .object({
    name: z.string(),
    price: z.number().optional(),
    point: z.number().optional(),
  })
  .strict();

const MarketSchema = z
  .object({
    key: z.string(),
    outcomes: z.array(OutcomeSchema),
  })
  .strict();

const BookmakerSchema = z
  .object({
    title: z.string(),
    last_update: z.string(),
    markets: z.array(MarketSchema),
  })
  .strict();

const OddsGameSchema = z
  .object({
    home_team: z.string(),
    away_team: z.string(),
    bookmakers: z.array(BookmakerSchema),
  })
  .strict();

export type OddsGame = z.infer<typeof OddsGameSchema>;

const CACHE_TTL = 60; // seconds
const CIRCUIT_TTL = 600; // 10 minutes
export const ERROR_BUDGET = 3;
const PROVIDER_TIMEOUT_MS = 3000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = PROVIDER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  backoff = 500,
): Promise<Response> {
  let res: Response = await fetchWithTimeout(url, options);
  for (let attempt = 0; attempt < retries && res.status === 429; attempt++) {
    await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
    res = await fetchWithTimeout(url, options);
  }
  return res;
}

export async function fetchOdds(league: League): Promise<OddsGame[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  const cache = getCacheDriver();
  const circuitKey = 'odds:circuit';
  if (await cache.get<boolean>(circuitKey)) {
    await logAdapterMetric('odds', 'circuit_bypass');
    return [];
  }
  const sport = ODDS_API_SPORT_MAP[league];
  const apiKey = ENV.ODDS_API_KEY;
  if (!sport || !apiKey) return [];
  const cacheKey = `odds:${sport}`;
  const cached = await cache.get<OddsGame[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=h2h,spreads,totals&apiKey=${apiKey}`;
  const start = Date.now();
  try {
    const res = await fetchWithRetry(url);
    if (res.status === 429) {
      throw new Error('ODDS_API_RATE_LIMIT');
    }
    const data = z.array(OddsGameSchema).parse(await res.json());
    await cache.set(cacheKey, data, CACHE_TTL);
    await cache.set('odds:failures', 0, CIRCUIT_TTL);
    await logAdapterMetric('odds', 'success', {
      latencyMs: Date.now() - start,
    });
    return data;
  } catch (err) {
    await logAdapterMetric('odds', 'error', { message: (err as Error).message });
    const failures = (await cache.get<number>('odds:failures')) ?? 0;
    const next = failures + 1;
    await cache.set('odds:failures', next, CIRCUIT_TTL);
    if (next >= ERROR_BUDGET) {
      await cache.set(circuitKey, true, CIRCUIT_TTL);
      await logAdapterMetric('odds', 'circuit_open', { failures: next });
    }
    return cached ?? [];
  }
}
