import { getFlag, setFlag } from '../lib/flags';

describe('feature flags', () => {
  beforeEach(() => {
    localStorage.clear();
    delete process.env.NEXT_PUBLIC_FLAG_TEST;
  });

  it('reads from localStorage before env', () => {
    process.env.NEXT_PUBLIC_FLAG_TEST = '0';
    setFlag('test', true);
    expect(localStorage.getItem('edgepicks.flag.test')).toBe('1');
    expect(getFlag('test')).toBe(true);
  });

  it('falls back to env when localStorage missing', () => {
    process.env.NEXT_PUBLIC_FLAG_TEST = '1';
    expect(getFlag('test')).toBe(true);
  });

  it('returns false when unset', () => {
    expect(getFlag('missing')).toBe(false);
  });
});
