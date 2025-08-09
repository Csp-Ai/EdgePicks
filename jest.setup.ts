import 'dotenv/config';
import '@testing-library/jest-dom';
import { freezeTime, resetTime } from './test/utils/freezeTime';
import { freezeRandom, resetRandom } from './test/utils/freezeRandom';

// Block accidental live network in tests (except localhost & msw)
const origFetch = global.fetch;
global.fetch = async (input: any, init?: any) => {
  const url = typeof input === 'string' ? input : input?.url ?? '';
  const allow = process.env.ALLOW_TEST_NETWORK === '1';
  if (!allow && url && !url.includes('localhost') && !url.startsWith('http://127.0.0.1')) {
    throw new Error(`[test-net-guard] Blocked network call in tests: ${url}`);
  }
  return origFetch(input as any, init as any);
};

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

beforeEach(() => {
  freezeTime();
  freezeRandom();
});

afterEach(() => {
  jest.useRealTimers?.();
  jest.clearAllTimers?.();
  jest.restoreAllMocks();
  resetTime();
  resetRandom();
});
