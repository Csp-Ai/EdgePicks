import { getStoredTheme, setStoredTheme } from '../lib/theme/persist';

describe('theme persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when unset', () => {
    expect(getStoredTheme()).toBeNull();
  });

  it('reads stored theme', () => {
    localStorage.setItem('theme', 'dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('writes theme to storage', () => {
    setStoredTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
