import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';
import { getCacheDriver } from '../infra/cache';
import { logAdapterMetric } from '../analytics/logUiEvent';

const TeamStatSchema = z
  .object({
    team: z.string(),
    efficiency: z.number(),
  })
  .strict();

export type TeamStat = z.infer<typeof TeamStatSchema>;

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
  backoff = 500
): Promise<Response> {
  let res: Response = await fetchWithTimeout(url, options);
  for (let attempt = 0; attempt < retries && res.status === 429; attempt++) {
    await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
    res = await fetchWithTimeout(url, options);
  }
  return res;
}

export async function fetchStats(_league: League): Promise<TeamStat[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  const cache = getCacheDriver();
  const circuitKey = 'stats:circuit';
  if (await cache.get<boolean>(circuitKey)) {
    await logAdapterMetric('stats', 'circuit_bypass');
    return [];
  }
  const cacheKey = 'stats:data';
  const cached = await cache.get<TeamStat[]>(cacheKey);
  if (cached) return cached;

  // Placeholder API - replace with real stats endpoint when available
  const url = 'https://example.com/stats';
  const start = Date.now();
  try {
    const res = await fetchWithRetry(url);
    if (res.status === 429) {
      throw new Error('STATS_API_RATE_LIMIT');
    }
    const data = z.array(TeamStatSchema).parse(await res.json());
    await cache.set(cacheKey, data, CACHE_TTL);
    await cache.set('stats:failures', 0, CIRCUIT_TTL);
    await logAdapterMetric('stats', 'success', { latencyMs: Date.now() - start });
    return data;
  } catch (err) {
    await logAdapterMetric('stats', 'error', { message: (err as Error).message });
    const failures = (await cache.get<number>('stats:failures')) ?? 0;
    const next = failures + 1;
    await cache.set('stats:failures', next, CIRCUIT_TTL);
    if (next >= ERROR_BUDGET) {
      await cache.set(circuitKey, true, CIRCUIT_TTL);
      await logAdapterMetric('stats', 'circuit_open', { failures: next });
    }
    return cached ?? [];
  }
}
