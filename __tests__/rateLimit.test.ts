import { createRateLimiter } from '../lib/server/rateLimit';

describe('rate limiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('allows under limit', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 2 });
    expect(check('1.1.1.1', 'foo')).toBe(true);
    expect(check('1.1.1.1', 'foo')).toBe(true);
  });

  test('blocks over limit', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 2 });
    check('1.1.1.1', 'foo');
    check('1.1.1.1', 'foo');
    expect(check('1.1.1.1', 'foo')).toBe(false);
  });

  test('resets after window', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(check('1.1.1.1', 'foo')).toBe(true);
    expect(check('1.1.1.1', 'foo')).toBe(false);
    jest.advanceTimersByTime(1000);
    expect(check('1.1.1.1', 'foo')).toBe(true);
  });
});
