import type { NextApiRequest, NextApiResponse } from 'next';
import { readAgentReflections } from '../../lib/agentReflectionStore';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const data = readAgentReflections();
  res.status(200).json(data);
}
