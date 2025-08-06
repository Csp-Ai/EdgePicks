import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';
import { authOptions } from './auth/[...nextauth]';
import { hasSportsDbKey } from '../../lib/env';

interface Game {
  homeTeam: { name: string };
  awayTeam: { name: string };
  time: string;
}

interface Prediction {
  game: Game;
  winner: string;
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

  const { league, games } = req.body || {};
  if (!league) {
    res.status(400).json({ error: 'league required' });
    return;
  }

  try {
    const predictions: Prediction[] = (games || []).map((g: Game) => ({
      game: g,
      winner: g.homeTeam.name,
      agentScores: {
        injuryScout: Math.random(),
        lineWatcher: Math.random(),
        statCruncher: Math.random(),
      },
    }));

    const agentScores: Record<string, number> = {
      injuryScout: Math.random(),
      lineWatcher: Math.random(),
      statCruncher: Math.random(),
    };

    const timestamp = new Date().toISOString();

    if (!hasSportsDbKey) {
      console.warn('No SPORTS_DB_API_KEY is set.');
    }
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
