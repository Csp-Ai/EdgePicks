# Prediction Cache

The prediction API uses a two-layer cache to avoid recomputation and reduce latency.

## Cache Keys

Keys combine the league, game, and agent list:

```ts
// lib/server/cache.ts
export function buildCacheKey(league: string, gameId: string, agents: string[]) {
  return `${league}:${gameId}:${agents.sort().join(',')}`;
}
```

Example: `NFL:g1:injuryScout,lineWatcher`.

## Time to Live (TTL)

Entries default to a configurable TTL (`PREDICTION_CACHE_TTL_SEC` or 60s). When a
request arrives, the in-memory map is checked first. If the entry is fresh, the
request takes the **warm path** and returns immediately. Otherwise, the request
falls back to Supabase and, if still missing or expired, recomputes the prediction
(the **cold path**).

## Local vs Supabase

- **Memory**: fast, process-local Map for current Node instance.
- **Supabase**: persistent store shared across instances via the
  `prediction_cache` table.

```ts
// lib/server/cache.ts
export async function getCachedPrediction(key: string) {
  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) {
    return { value: entry.value, cached: true };
  }
  const { data } = await supabase
    .from('prediction_cache')
    .select('value, expires_at')
    .eq('key', key)
    .single();
  if (!data) return { value: null, cached: false };
  const exp = new Date(data.expires_at).getTime();
  if (exp < now) return { value: null, cached: false };
  memoryCache.set(key, { value: data.value, expiresAt: exp });
  return { value: data.value, cached: true };
}
```

## Invalidation

Cache entries expire automatically via TTL. Manual invalidation is available via
`purgeCache`, which accepts a specific key or prefix:

```ts
// lib/server/cache.ts
export function purgeCache({ key, prefix }: { key?: string; prefix?: string } = {}) {
  for (const k of Array.from(memoryCache.keys())) {
    if (key && k !== key) continue;
    if (prefix && !k.startsWith(prefix)) continue;
    memoryCache.delete(k);
  }
}
```

This enables targeted clears (single matchup) or full wipes (by league).
