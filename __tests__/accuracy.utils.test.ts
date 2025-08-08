/** @jest-environment node */
import type { AgentOutputs } from '../lib/types';
import outcomes from './fixtures/agent_outcomes.json';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({ supabase: { from: jest.fn() } }));
jest.mock('../lib/agents/registry', () => ({
  registry: [
    { name: 'injuryScout' },
    { name: 'lineWatcher' },
  ],
}));

import { recordAgentOutcomes, recomputeAccuracy } from '../lib/accuracy';

describe('accuracy utils', () => {
  beforeEach(() => {
    (supabase.from as jest.Mock).mockReset();
  });

  describe('recordAgentOutcomes', () => {
    it('writes agent outcomes to supabase', async () => {
      const agents: AgentOutputs = {
        injuryScout: { team: outcomes[0].team, score: outcomes[0].confidence, reason: '' },
        lineWatcher: { team: outcomes[2].team, score: outcomes[2].confidence, reason: '' },
      };
      const upsert = jest.fn().mockResolvedValue({});
      (supabase.from as jest.Mock).mockReturnValue({ upsert });

      await recordAgentOutcomes('game-1', agents, outcomes[0].team, '2024-01-01');

      expect(supabase.from).toHaveBeenCalledWith('agent_outcomes');
      expect(upsert).toHaveBeenCalledWith(
        [
          {
            game_id: 'game-1',
            agent: 'injuryScout',
            pick: outcomes[0].team,
            correct: true,
            confidence: outcomes[0].confidence,
            ts: '2024-01-01',
          },
          {
            game_id: 'game-1',
            agent: 'lineWatcher',
            pick: outcomes[2].team,
            correct: false,
            confidence: outcomes[2].confidence,
            ts: '2024-01-01',
          },
        ],
        { onConflict: 'game_id,agent' }
      );
    });

    it('skips when no agent outputs', async () => {
      await recordAgentOutcomes('game-1', {} as AgentOutputs, 'A');
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('recomputeAccuracy', () => {
    it('aggregates agent and flow accuracy', async () => {
      const matchups = [
        {
          agents: {
            injuryScout: { team: outcomes[0].team },
            lineWatcher: { team: outcomes[2].team },
          },
          pick: { winner: outcomes[0].team },
          actual_winner: outcomes[0].team,
          flow: 'alpha',
        },
        {
          agents: {
            injuryScout: { team: outcomes[1].opponent },
            lineWatcher: { team: outcomes[2].team },
          },
          pick: { winner: outcomes[1].opponent },
          actual_winner: outcomes[2].team,
          flow: 'beta',
        },
      ];

      const select = jest.fn().mockResolvedValue({ data: matchups, error: null });
      const upsert = jest.fn().mockResolvedValue({});
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'matchups') return { select };
        return { upsert };
      });

      const result = await recomputeAccuracy();

      expect(select).toHaveBeenCalled();
      expect(upsert).toHaveBeenCalledTimes(2);
      expect(result.agentStats).toEqual(
        [
          { agent: 'injuryScout', wins: 1, losses: 1, accuracy: 0.5 },
          { agent: 'lineWatcher', wins: 1, losses: 1, accuracy: 0.5 },
        ]
      );
      expect(result.flowStats).toEqual(
        [
          { flow: 'alpha', wins: 1, losses: 0, accuracy: 1 },
          { flow: 'beta', wins: 0, losses: 1, accuracy: 0 },
        ]
      );
    });
  });
});

