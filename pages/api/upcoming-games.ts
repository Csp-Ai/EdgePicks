import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUpcomingGames } from '../../lib/data/liveSports';
import { runFlow, AgentExecution } from '../../lib/flow/runFlow';
import { agents as registry } from '../../lib/agents/registry';
import type { AgentOutputs, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const games = await fetchUpcomingGames();
    const agentList = ['injuryScout', 'lineWatcher', 'statCruncher', 'guardianAgent'] as const;
    const results: {
      homeTeam: { name: string };
      awayTeam: { name: string };
      confidence: number;
      history?: number[];
      time: string;
      league: string;
      edgePick: AgentExecution[];
    }[] = [];

    for (const game of games) {
      const executions: AgentExecution[] = [];
      const outputs = await runFlow({ name: 'upcoming', agents: [...agentList] }, game, (exec) =>
        executions.push(exec)
      );

      const scores: Record<string, number> = {
        [game.homeTeam]: 0,
        [game.awayTeam]: 0,
      };

      agentList.forEach((name) => {
        const meta = registry.find((a) => a.name === name);
        const result = outputs[name];
        if (!meta || !result) return;
        scores[result.team] += result.score * meta.weight;
      });

      const winner =
        scores[game.homeTeam] >= scores[game.awayTeam] ? game.homeTeam : game.awayTeam;
      const confidenceRaw = Math.max(scores[game.homeTeam], scores[game.awayTeam]);
      const confidence = Math.round(confidenceRaw * 100);
      const topReasons = agentList
        .map((name) => outputs[name]?.reason)
        .filter((r): r is string => Boolean(r));

      const pickSummary: PickSummary = { winner, confidence: confidenceRaw, topReasons };

      logToSupabase(game, outputs as AgentOutputs, pickSummary, null, 'upcoming-games', true);

      results.push({
        homeTeam: { name: game.homeTeam },
        awayTeam: { name: game.awayTeam },
        confidence,
        time: game.time,
        league: game.league,
        edgePick: executions,
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching upcoming games:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming games' });
  }
}

