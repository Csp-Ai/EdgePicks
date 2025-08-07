import type { NextApiRequest, NextApiResponse } from 'next';
import { registry as agentRegistry } from '../../lib/agents/registry';
import {
  readAgentLog,
  getAllAgentLogs,
  clearAgentLogs,
} from '../../lib/agentLogsStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { sessionId, agentId } = req.query;
    if (typeof sessionId === 'string' && typeof agentId === 'string') {
      const data = await readAgentLog(sessionId, agentId);
      if (!data) {
        res.status(404).json({ error: 'Log not found' });
        return;
      }
      const meta = agentRegistry.find((a) => a.name === agentId);
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
    const logs = await getAllAgentLogs();
    res.status(200).json(logs);
    return;
  }

  if (req.method === 'DELETE') {
    await clearAgentLogs();
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
