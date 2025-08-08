import type { NextApiRequest, NextApiResponse } from 'next';
import { readAgentReflections } from '../../lib/writeAgentReflection';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const data = await readAgentReflections();
  res.status(200).json(data);
}
