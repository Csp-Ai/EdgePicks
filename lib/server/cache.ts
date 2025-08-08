import { supabase } from '../supabaseClient';

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();
const DEFAULT_TTL = parseInt(process.env.PREDICTION_CACHE_TTL_SEC || '60', 10);

export function buildCacheKey(league: string, gameId: string, agents: string[]) {
  return `${league}:${gameId}:${agents.sort().join(',')}`;
}

export async function getCachedPrediction(key: string) {
  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) {
    return { value: entry.value, cached: true };
  }

  try {
    const { data, error } = await supabase
      .from('prediction_cache')
      .select('value, expires_at')
      .eq('key', key)
      .single();
    if (!data || error) return { value: null, cached: false };
    const exp = new Date(data.expires_at).getTime();
    if (exp < now) return { value: null, cached: false };
    memoryCache.set(key, { value: data.value, expiresAt: exp });
    return { value: data.value, cached: true };
  } catch (err) {
    console.error('cache fetch error', err);
    return { value: null, cached: false };
  }
}

export async function setCachedPrediction(key: string, value: any, ttl = DEFAULT_TTL) {
  const expiresAt = Date.now() + ttl * 1000;
  memoryCache.set(key, { value, expiresAt });
  try {
    await supabase
      .from('prediction_cache')
      .upsert({ key, value, expires_at: new Date(expiresAt).toISOString() });
  } catch (err) {
    console.error('cache store error', err);
  }
}

export function purgeCache({ key, prefix }: { key?: string; prefix?: string } = {}) {
  for (const k of Array.from(memoryCache.keys())) {
    if (key && k !== key) continue;
    if (prefix && !k.startsWith(prefix)) continue;
    memoryCache.delete(k);
  }
}
