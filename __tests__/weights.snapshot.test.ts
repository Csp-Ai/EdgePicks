jest.mock('../lib/supabaseClient', () => ({ supabase: { from: jest.fn() } }));
import { getDynamicWeights } from '../lib/weights';
import { supabase } from '../lib/supabaseClient';

describe('getDynamicWeights snapshots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reads latest snapshot first', async () => {
    const limit = jest.fn().mockResolvedValue({
      data: [
        { agent: 'injuryScout', weight: 0.7, ts: '2024-02-01' },
        { agent: 'injuryScout', weight: 0.6, ts: '2024-01-01' },
      ],
      error: null,
    });
    const order = jest.fn().mockReturnValue({ limit });
    const select = jest.fn().mockReturnValue({ order });
    (supabase.from as jest.Mock).mockReturnValueOnce({ select });

    const weights = await getDynamicWeights();
    expect(supabase.from).toHaveBeenCalledWith('agent_weights_snapshot');
    expect(weights.injuryScout).toBe(0.7);
  });

  it('falls back to compute when no snapshot', async () => {
    const limitSnap = jest.fn().mockResolvedValue({ data: [], error: null });
    const orderSnap = jest.fn().mockReturnValue({ limit: limitSnap });
    const selectSnap = jest.fn().mockReturnValue({ order: orderSnap });
    const selectStats = jest.fn().mockResolvedValue({
      data: [{ agent: 'injuryScout', wins: 1, losses: 0 }],
      error: null,
    });
    (supabase.from as jest.Mock)
      .mockReturnValueOnce({ select: selectSnap })
      .mockReturnValueOnce({ select: selectStats });

    const weights = await getDynamicWeights();
    expect(supabase.from).toHaveBeenCalledWith('agent_weights_snapshot');
    expect(supabase.from).toHaveBeenCalledWith('agent_stats');
    expect(weights.injuryScout).toBeGreaterThan(0.5);
  });
});
