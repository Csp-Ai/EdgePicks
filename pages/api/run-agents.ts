// Simple in-memory cache
const cache = new Map<string, any>();

export async function purgeRunAgentsCache(key?: string, prefix?: string) {
  if (key) {
    cache.delete(key);
  }
  if (prefix) {
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) {
        cache.delete(k);
      }
    }
  }
}
