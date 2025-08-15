import { loadAgents } from './loadAgents';
import { Matchup, PickWithReasoning, Reason } from '../types';

export const pickBot = async (matchup: Matchup): Promise<PickWithReasoning> => {
  const agents = await loadAgents();
  const results = await Promise.all(agents.map((a) => a.run(matchup)));

  const teams = [matchup.homeTeam, matchup.awayTeam];
  const scores: Record<string, number> = { [teams[0]]: 0, [teams[1]]: 0 };

  results.forEach((result, idx) => {
    const weight = agents[idx].weight;
    const key = result.team;
    if (key === undefined) return;
    const score = result?.score ?? 0;
    scores[key] += score * weight;
  });

  const pick = scores[teams[0]] >= scores[teams[1]] ? teams[0] : teams[1];
  const confidence = Math.max(scores[teams[0]], scores[teams[1]]);

  return {
    winner: pick,
    confidence,
    reasons: results.map((r) => ({
      agent: r.name,
      explanation: r.reason,
      weight: 1,
    })) as Reason[],
  };
};
