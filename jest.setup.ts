import 'dotenv/config';
import { freezeTime, resetTime } from './lib/test/freezeTime';
import { server } from './test/msw/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  freezeTime();
});
afterEach(() => {
  jest.useRealTimers?.();
  jest.clearAllTimers?.();
  jest.restoreAllMocks();
  resetTime();
  server.resetHandlers();
});
afterAll(() => server.close());

// Place network guard AFTER MSW so mocks still work
import { installNetworkGuard } from './lib/test/networkGuard';
installNetworkGuard();

import '@testing-library/jest-dom';

const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Cannot log after tests are done')) {
    return;
  }
  originalError(...args);
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      events: { on: jest.fn(), off: jest.fn() },
      prefetch: jest.fn().mockResolvedValue(null),
    };
  },
}));

class MockEventSource {
  url: string;
  readyState = 0;
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  constructor(url: string) {
    this.url = url;
  }
  addEventListener() {}
  removeEventListener() {}
  close() {
    this.readyState = 2;
  }
}
// @ts-ignore
global.EventSource = MockEventSource;

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'test-anon';
process.env.NEXTAUTH_URL = 'http://localhost';
process.env.NEXTAUTH_SECRET = 'secret';
process.env.SPORTS_API_KEY = 'test';
process.env.GOOGLE_CLIENT_ID = 'google-id';
process.env.GOOGLE_CLIENT_SECRET = 'google-secret';
process.env.LIVE_MODE = 'on';
process.env.PREDICTION_CACHE_TTL_SEC = '120';
process.env.MAX_FLOW_CONCURRENCY = '3';
process.env.GITHUB_REPOSITORY = 'owner/repo';

jest.mock('./lib/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        insert: jest.fn(() => ({ select: () => ({ single: () => Promise.resolve({ data: { id: '1' }, error: null }) }) })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ single: () => Promise.resolve({ data: null, error: null }) })),
        })),
        upsert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    },
  };
});

import "whatwg-fetch";            // fetch in jsdom
import "@/lib/fetch-guard";       // defines globalThis.originalFetch

// Default mock for app’s API endpoints that tests hit (tune as needed)
const okJson = (data: any) =>
  Promise.resolve(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

beforeAll(() => {
  const realFetch = global.fetch.bind(global);

  jest
    .spyOn(global, "fetch")
    .mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      if (url.includes("/api/upcoming-games")) {
        return okJson({ games: [] });
      }
      if (url.includes("/api/accuracy")) {
        return okJson({ value: 0 });
      }
      if (url.includes("/api/accuracy-history")) {
        return okJson({ history: [] });
      }

      // Fall back to real fetch for anything else (or return a 404-style Response if you prefer)
      return realFetch(input as any, init);
    });
});
