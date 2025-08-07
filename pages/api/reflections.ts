import type { NextApiRequest, NextApiResponse } from 'next';
import { readAgentReflections } from '../../lib/agentReflectionStore';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const data = await readAgentReflections();
  res.status(200).json(data);
}
