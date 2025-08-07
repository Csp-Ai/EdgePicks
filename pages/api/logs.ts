import type { NextApiRequest, NextApiResponse } from 'next';
import { readAgentLog } from '../../lib/agentLogsStore';
import { agents } from '../../lib/agents/registry';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId, agentId } = req.query;
  if (typeof sessionId !== 'string' || typeof agentId !== 'string') {
    res.status(400).json({ error: 'sessionId and agentId are required' });
    return;
  }
  const data = readAgentLog(sessionId, agentId);
  if (!data) {
    res.status(404).json({ error: 'Log not found' });
    return;
  }
  const meta = agents.find((a) => a.name === agentId);
  const weightedScore = data.output?.score * (meta?.weight ?? 1);
  res.status(200).json({
    output: data.output || null,
    reasoning: data.output?.reason,
    duration: data.durationMs,
    error: data.error,
    weightedScore,
  });
}
