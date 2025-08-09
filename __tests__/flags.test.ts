import { getFlag, setFlag } from '../lib/flags/flags';
import { experiments } from '../lib/flags/experiments';

describe('feature flags', () => {
  beforeEach(() => {
    localStorage.clear();
    delete process.env.NEXT_PUBLIC_FF_DEMOMODE;
    window.history.replaceState({}, '', '/');
  });

  it('resolves in priority order', () => {
    // default
    expect(getFlag('demoMode')).toBe(experiments.demoMode);

    // env overrides default
    process.env.NEXT_PUBLIC_FF_DEMOMODE = 'on';
    expect(getFlag('demoMode')).toBe(true);

    // storage overrides env
    setFlag('demoMode', false);
    expect(getFlag('demoMode')).toBe(false);

    // url overrides storage
    window.history.replaceState({}, '', '/?ff.demoMode=on');
    expect(getFlag('demoMode')).toBe(true);
  });

  it('serializes and deserializes', () => {
    setFlag('demoMode', true);
    expect(localStorage.getItem('ff.demoMode')).toBe('on');
    expect(getFlag('demoMode')).toBe(true);

    setFlag('demoMode', false);
    expect(localStorage.getItem('ff.demoMode')).toBe('off');
    expect(getFlag('demoMode')).toBe(false);
  });
});
