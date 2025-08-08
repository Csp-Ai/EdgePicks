import { getProgress, setProgress, clearProgress, STORAGE_KEY } from '../lib/onboarding/progress';

describe('onboarding progress storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 0 when no progress stored', () => {
    expect(getProgress()).toBe(0);
  });

  it('persists and clears progress', () => {
    setProgress(2);
    expect(getProgress()).toBe(2);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('2');
    clearProgress();
    expect(getProgress()).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
