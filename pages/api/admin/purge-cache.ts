import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { purgeRunAgentsCache } from '../run-agents';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.headers['admin_api_key'];
  if (!adminKey || provided !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const key = typeof req.query.key === 'string' ? req.query.key : undefined;
  const prefix =
    typeof req.query.prefix === 'string' ? req.query.prefix : undefined;

  if (!key && !prefix) {
    res.status(400).json({ error: 'Must provide key or prefix' });
    return;
  }

  purgeRunAgentsCache({ key, prefix });

  try {
    let query: any = supabase.from('prediction_cache').delete();
    if (key) query = query.eq('key', key);
    if (prefix) query = query.like('key', `${prefix}%`);
    await query;
  } catch (err) {
    console.error('cache purge error', err);
  }

  res.status(200).json({ success: true });
}

