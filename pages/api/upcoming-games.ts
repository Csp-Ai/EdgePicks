import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUpcomingGames } from '../../lib/data/liveSports';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow, AgentExecution } from '../../lib/flow/runFlow';
import { agents as registry } from '../../lib/agents/registry';
import type { AgentOutputs, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const games = await fetchUpcomingGames();
    const results = [] as {
      homeTeam: string;
      awayTeam: string;
      matchDay?: number;
      league?: string;
      time?: string;
      edgePick: {
        winner: string;
        confidence: number;
        topReasons: string[];
        agents: AgentExecution[];
      };
    }[];

    for (const game of games) {
      const flow = await loadFlow('football-pick');
      const executions: AgentExecution[] = [];
      const outputs = await runFlow(flow, game, (exec) => executions.push(exec));

      const scores: Record<string, number> = {
        [game.homeTeam]: 0,
        [game.awayTeam]: 0,
      };

      flow.agents.forEach((name) => {
        const meta = registry.find((a) => a.name === name);
        const result = outputs[name];
        if (!meta || !result) return;
        scores[result.team] += result.score * meta.weight;
      });

      const winner =
        scores[game.homeTeam] >= scores[game.awayTeam]
          ? game.homeTeam
          : game.awayTeam;
      const confidence = Math.max(scores[game.homeTeam], scores[game.awayTeam]);
      const topReasons = flow.agents
        .map((name) => outputs[name]?.reason)
        .filter((r): r is string => Boolean(r));
      const pickSummary: PickSummary = {
        winner,
        confidence,
        topReasons,
      };

      logToSupabase(
        game,
        outputs as AgentOutputs,
        pickSummary,
        null,
        'football-pick',
        { isAutoPick: true }
      );

      results.push({
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        matchDay: game.matchDay,
        league: game.league,
        time: game.time,
        edgePick: {
          winner,
          confidence,
          topReasons,
          agents: executions,
        },
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching upcoming games:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming games' });
  }
}
