import '@testing-library/jest-dom';

const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Cannot log after tests are done')) {
    return;
  }
  originalError(...args);
};

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'test-anon';
process.env.NEXTAUTH_URL = 'http://localhost';
process.env.NEXTAUTH_SECRET = 'secret';
process.env.GOOGLE_CLIENT_ID = 'google-id';
process.env.GOOGLE_CLIENT_SECRET = 'google-secret';
process.env.SPORTS_API_KEY = 'sports-key';
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

afterEach(() => {
  jest.useRealTimers?.();
  jest.clearAllTimers?.();
  jest.restoreAllMocks();
});
