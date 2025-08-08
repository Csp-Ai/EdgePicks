import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

import { registry as agentRegistry } from '../../lib/agents/registry';
import type { AgentMeta, AgentName } from '../../lib/agents/registry';

import { readAgentLog, clearAgentLogs } from '../../lib/agentLogsStore';
import { ENV } from '../../lib/env';

interface LogEntry {
  id: string;
  ts: string;
  level: string;
  message: string;
  meta?: Record<string, any>;
}

function parseLlms(raw: string): LogEntry[] {
  const blocks = raw.split(/Timestamp:\s*/).slice(1);
  return blocks.map((block, idx) => {
    const lines = block.split('\n');
    const ts = lines[0]?.trim() ?? '';
    const message = lines.slice(1).join('\n').trim();
    return {
      id: String(idx),
      ts,
      level: 'info',
      message,
    };
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const agentMetaMap = new Map<AgentName, AgentMeta>(
    agentRegistry.map((a) => [a.name as AgentName, a])
  );

  if (req.method === 'GET') {
    const { sessionId, agentId } = req.query;
    if (typeof sessionId === 'string' && typeof agentId === 'string') {
      const data = await readAgentLog(sessionId, agentId);
      if (!data) {
        res.status(404).json({ error: 'Log not found' });
        return;
      }

      const meta = agentMetaMap.get(agentId as AgentName);

      const weightedScore = data.output?.score * (meta?.weight ?? 1);
      res.status(200).json({
        output: data.output || null,
        reasoning: data.output?.reason,
        duration: data.durationMs,
        error: data.error,
        weightedScore,
      });
      return;
    }
    if (ENV.LIVE_MODE !== 'on') {
      const mock: LogEntry[] = [
        {
          id: 'mock-1',
          ts: '2025-01-01T00:00:00.000Z',
          level: 'info',
          message: 'mock log entry',
        },
      ];
      res.status(200).json({ items: mock });
      return;
    }
    try {
      const filePath = path.join(process.cwd(), 'llms.txt');
      const raw = await fs.readFile(filePath, 'utf8');
      const items = parseLlms(raw);
      res.status(200).json({ items });
    } catch {
      res.status(500).json({ items: [] });
    }
    return;
  }

  if (req.method === 'DELETE') {
    if (ENV.LIVE_MODE === 'on') {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        res.status(401).json({ error: 'auth_required' });
        return;
      }
    }
    await clearAgentLogs();
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
