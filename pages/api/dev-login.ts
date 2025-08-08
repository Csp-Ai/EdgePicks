import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    res.status(404).end();
    return;
  }

  res.status(200).json({ id: 'dev-user', name: 'Dev User' });
}
