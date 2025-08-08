jest.mock('../lib/supabaseClient', () => ({ supabase: { from: jest.fn() } }));
import { computeWeight } from '../lib/weights';

describe('computeWeight', () => {
  it('returns 0.5 when no outcomes', () => {
    expect(computeWeight({ wins: 0, losses: 0 })).toBeCloseTo(0.5);
  });

  it('calculates higher weight for more wins', () => {
    const w = computeWeight({ wins: 9, losses: 1 });
    expect(w).toBeGreaterThan(0.5);
  });

  it('caps weight within min and max', () => {
    const high = computeWeight({ wins: 100, losses: 0 });
    const low = computeWeight({ wins: 0, losses: 100 });
    expect(high).toBeLessThanOrEqual(0.9);
    expect(low).toBeGreaterThanOrEqual(0.1);
  });
});
