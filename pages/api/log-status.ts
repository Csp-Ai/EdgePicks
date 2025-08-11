import type { NextApiRequest, NextApiResponse } from 'next';
import { getLogStatus, logToSupabase } from '@/lib/logToSupabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { event, metadata = {}, correlationId } = req.body || {};
    logToSupabase('ui_events', {
      event,
      metadata,
      correlation_id: correlationId,
      created_at: new Date().toISOString(),
    });
    res.status(202).json({ ok: true });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(await getLogStatus());
    return;
  }

  res.status(405).end();
}
