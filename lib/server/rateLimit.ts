interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

interface Entry {
  count: number;
  expiresAt: number;
}

export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
  const hits = new Map<string, Entry>();

  return function check(ip: string, key = 'global'): boolean {
    const id = `${ip}:${key}`;
    const now = Date.now();
    const entry = hits.get(id);

    if (!entry || entry.expiresAt <= now) {
      hits.set(id, { count: 1, expiresAt: now + windowMs });
      return true;
    }

    if (entry.count >= max) {
      return false;
    }

    entry.count += 1;
    return true;
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
