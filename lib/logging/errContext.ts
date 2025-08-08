export type ErrorWithContext = Error & { context?: Record<string, unknown> };

function safeClone<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return {} as T;
  }
}

const SECRET_KEYS = ['password', 'secret', 'token', 'apikey', 'apiKey'];

function redactSecrets(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(redactSecrets);
    }
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => {
        if (SECRET_KEYS.some((s) => key.toLowerCase().includes(s))) {
          return [key, '[REDACTED]'];
        }
        return [key, redactSecrets(val)];
      }),
    );
  }
  return obj;
}

export function withErrContext(err: unknown, ctx: Record<string, unknown>): ErrorWithContext {
  const e: ErrorWithContext = err instanceof Error ? err : new Error(String(err));
  const existing = e.context && typeof e.context === 'object' ? e.context : {};
  e.context = { ...existing, ...safeClone(ctx) };
  return e;
}

export function formatErrForLog(err: ErrorWithContext): string {
  const base: Record<string, unknown> = {
    message: err.message,
    stack: err.stack,
  };
  if (err.context) {
    base.context = redactSecrets(err.context);
  }
  return JSON.stringify(base);
}
