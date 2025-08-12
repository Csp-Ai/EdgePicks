const cache = new Map<string, { data: any; expiry: number }>();

export function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

export function setToCache(key: string, data: any, ttl: number): void {
  const expiry = Date.now() + ttl;
  cache.set(key, { data, expiry });
}

export function clearCache(key: string): void {
  cache.delete(key);
}

export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiry <= now) {
      cache.delete(key);
    }
  }
}
