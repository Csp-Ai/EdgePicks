
import { supabase } from '../supabaseClient';

export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

export function createMemoryStore(): CacheStore {
  const store = new Map<string, MemoryEntry>();
  return {
    async get(key: string): Promise<string | null> {
      const entry = store.get(key);
      if (!entry) return null;
      if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return null;
      }
      return entry.value;
    },
    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    },
  };
}

const defaultStore = createMemoryStore();

export async function getCache<T>(key: string, store: CacheStore = defaultStore): Promise<T | null> {
  const raw = await store.get(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
  store: CacheStore = defaultStore,
): Promise<void> {
  const raw = JSON.stringify(value);
  await store.set(key, raw, ttlSeconds);
}

export async function withTtl<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  store: CacheStore = defaultStore,
): Promise<T> {
  const cached = await getCache<T>(key, store);
  if (cached !== null) return cached;
  const value = await fn();
  await setCache(key, value, ttlSeconds, store);
  return value;
}

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();
const DEFAULT_TTL = parseInt(process.env.PREDICTION_CACHE_TTL_SEC || '60', 10);

export function buildCacheKey(league: string, gameId: string, agents: string[]) {
  return `${league}:${gameId}:${agents.sort().join(',')}`;
}

export function cache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  let memo: Promise<ReturnType<T>> | null = null;
  return (async (...args: Parameters<T>) => {
    if (!memo) {
      memo = fn(...args);
    }
    return memo as Promise<ReturnType<T>>;
  }) as T;
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

export async function getClient() {
  return {
    async keys(_pattern: string): Promise<string[]> {
      return Array.from(memoryCache.keys());
    },
    async del(...keys: string[]): Promise<void> {
      keys.forEach(k => memoryCache.delete(k));
    },
    async quit(): Promise<void> {
      // no-op for in-memory client
    },
  };
}
