import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { NODE_ENV, NEXT_PUBLIC_MOCK_AUTH } = process.env;

  if (NODE_ENV !== 'development' && NEXT_PUBLIC_MOCK_AUTH !== '1') {
    return res.status(403).end();
  }

  res.status(200).json({ id: 'dev-user', name: 'Dev User' });
}
