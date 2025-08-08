import { contrastRatio, meetsAA } from '../lib/theme/contrast';

describe('theme contrast', () => {
  const tokens = {
    foreground: '#111111',
    background: '#ffffff',
    muted: '#9ca3af',
    mid: '#777777',
  };

  it('computes contrast ratio between tokens', () => {
    expect(contrastRatio('foreground', 'background', tokens)).toBeCloseTo(18.88, 2);
  });

  it('meets AA for normal text', () => {
    expect(meetsAA('foreground', 'background', tokens)).toBe(true);
  });

  it('fails AA for low contrast text', () => {
    expect(meetsAA('muted', 'background', tokens)).toBe(false);
  });

  it('applies lower threshold for large text', () => {
    expect(meetsAA('mid', 'background', tokens)).toBe(false);
    expect(meetsAA('mid', 'background', tokens, { largeText: true })).toBe(true);
  });
});
