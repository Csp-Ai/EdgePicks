import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhookSignature } from '../../lib/utils/verifyWebhookSignature';
import { logToSupabase } from '../../lib/logToSupabase';
import { ENV } from '../../lib/env';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const secret = ENV.SPORTS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('SPORTS_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'server_error' });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-sports-signature'];

  if (typeof signature !== 'string' || !verifyWebhookSignature(rawBody, signature, secret)) {
    console.warn('Invalid webhook signature');
    logToSupabase('webhook_events', {
      event: 'invalid_signature',
      signature: typeof signature === 'string' ? signature : undefined,
      payload: rawBody,
    });
    return res.status(401).json({ error: 'invalid_signature' });
  }

  return res.status(200).json({ received: true });
}
