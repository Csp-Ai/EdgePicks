import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';
import { authOptions } from './auth/[...nextauth]';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow } from '../../lib/flow/runFlow';
import { agents } from '../../lib/agents/registry';
import type { Matchup } from '../../lib/types';
import { ENV } from '../../lib/env';

interface Game {
  homeTeam: { name: string };
  awayTeam: { name: string };
  time: string;
}

interface Prediction {
  game: Game;
  winner: string;
  confidence: number;
  agentScores: Record<string, number>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  if (ENV.SPORTS_API_KEY === 'sports-fallback-key' && process.env.NODE_ENV === 'development') {
    console.warn('[Dev Warning] Using mock data. Add SPORTS_API_KEY to .env.local');
  }

  const { league, games } = req.body || {};
  if (!league) {
    res.status(400).json({ error: 'league required' });
    return;
  }

  try {
    const flow = await loadFlow('football-pick');
    const predictions: Prediction[] = [];
    const aggregatedAgentScores: Record<string, number> = {};

    for (const g of games || []) {
      const matchup: Matchup = {
        homeTeam: g.homeTeam.name,
        awayTeam: g.awayTeam.name,
        time: g.time,
        league,
      };

      const { outputs } = await runFlow(flow, matchup);

      const scores: Record<string, number> = {
        [matchup.homeTeam]: 0,
        [matchup.awayTeam]: 0,
      };

      const agentScores: Record<string, number> = {};
      for (const name of flow.agents) {
        const meta = agents.find((a) => a.name === name);
        const result = outputs[name];
        if (!meta || !result) continue;
        scores[result.team] += result.score * meta.weight;
        agentScores[name] = result.score;
        aggregatedAgentScores[name] =
          (aggregatedAgentScores[name] || 0) + result.score;
      }

      const winner =
        scores[matchup.homeTeam] >= scores[matchup.awayTeam]
          ? matchup.homeTeam
          : matchup.awayTeam;
      const confidence = Math.max(
        scores[matchup.homeTeam],
        scores[matchup.awayTeam]
      );

      predictions.push({ game: g, winner, confidence, agentScores });
    }

    const agentScores: Record<string, number> = {};
    const total = predictions.length || 1;
    Object.entries(aggregatedAgentScores).forEach(([name, score]) => {
      agentScores[name] = score / total;
    });

    const timestamp = new Date().toISOString();

    if ((games || []).some((g: any) => g.useFallback || g.source === 'fallback')) {
      console.warn('Mock data is being used for predictions.');
    }

    try {
      const logPath = path.join(process.cwd(), 'llms.txt');
      const entry = `[${timestamp}] [${league}] predictions run by ${
        session.user?.name || 'Anonymous'
      }\n`;
      await fs.promises.appendFile(logPath, entry);
    } catch (err) {
      console.error('failed to log prediction', err);
    }

    res.status(200).json({ predictions, agentScores, timestamp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to run predictions' });
  }
}
