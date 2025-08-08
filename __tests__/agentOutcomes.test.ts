/** @jest-environment node */
import { recordAgentOutcomes } from '../lib/accuracy';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

describe('recordAgentOutcomes', () => {
  it('stores outcomes per agent', async () => {
    const upsert = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({ upsert });

    const agents = {
      injuryScout: { team: 'A', score: 0.7, reason: 'x' },
      lineWatcher: { team: 'B', score: 0.6, reason: 'y' },
    } as any;

    await recordAgentOutcomes('game1', agents, 'A', '2024-01-01');

    expect(supabase.from).toHaveBeenCalledWith('agent_outcomes');
    expect(upsert).toHaveBeenCalledWith(
      [
        {
          game_id: 'game1',
          agent: 'injuryScout',
          pick: 'A',
          correct: true,
          confidence: 0.7,
          ts: '2024-01-01',
        },
        {
          game_id: 'game1',
          agent: 'lineWatcher',
          pick: 'B',
          correct: false,
          confidence: 0.6,
          ts: '2024-01-01',
        },
      ],
      { onConflict: 'game_id,agent' }
    );
  });
});
