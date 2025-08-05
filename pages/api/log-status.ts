import type { NextApiRequest, NextApiResponse } from 'next';
import { getLogStatus } from '../../lib/logToSupabase';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(getLogStatus());
}
