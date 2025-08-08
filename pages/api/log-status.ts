import type { NextApiRequest, NextApiResponse } from 'next';
import { getLogStatus } from '../../lib/logToSupabase';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await getLogStatus());
}
