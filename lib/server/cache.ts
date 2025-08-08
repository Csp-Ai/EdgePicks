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
