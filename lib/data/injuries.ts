import { z } from 'zod';
import { ENV } from '../env';
import type { League } from './schedule';
import { getCacheDriver } from '../infra/cache';
import { logAdapterMetric } from '../analytics/logUiEvent';

const InjurySchema = z
  .object({
    team: z.string(),
    player: z.string(),
    status: z.string().optional(),
  })
  .strict();

export type Injury = z.infer<typeof InjurySchema>;

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

export async function fetchInjuries(_league: League): Promise<Injury[]> {
  if (ENV.LIVE_MODE !== 'on') return [];
  const cache = getCacheDriver();
  const circuitKey = 'injuries:circuit';
  if (await cache.get<boolean>(circuitKey)) {
    await logAdapterMetric('injuries', 'circuit_bypass');
    return [];
  }
  const cacheKey = 'injuries:data';
  const cached = await cache.get<Injury[]>(cacheKey);
  if (cached) return cached;

  // Placeholder API - replace with real injury endpoint when available
  const url = 'https://example.com/injuries';
  const start = Date.now();
  try {
    const res = await fetchWithRetry(url);
    if (res.status === 429) {
      throw new Error('INJURY_API_RATE_LIMIT');
    }
    const data = z.array(InjurySchema).parse(await res.json());
    await cache.set(cacheKey, data, CACHE_TTL);
    await cache.set('injuries:failures', 0, CIRCUIT_TTL);
    await logAdapterMetric('injuries', 'success', {
      latencyMs: Date.now() - start,
    });
    return data;
  } catch (err) {
    await logAdapterMetric('injuries', 'error', {
      message: (err as Error).message,
    });
    const failures = (await cache.get<number>('injuries:failures')) ?? 0;
    const next = failures + 1;
    await cache.set('injuries:failures', next, CIRCUIT_TTL);
    if (next >= ERROR_BUDGET) {
      await cache.set(circuitKey, true, CIRCUIT_TTL);
      await logAdapterMetric('injuries', 'circuit_open', { failures: next });
    }
    return cached ?? [];
  }
}
