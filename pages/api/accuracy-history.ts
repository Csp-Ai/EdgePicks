import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export interface WeeklyAccuracy {
  week: string;
  accuracy: number;
}

export const MOCK_ACCURACY_HISTORY: WeeklyAccuracy[] = [
  { week: '2024-01-01', accuracy: 0.6 },
  { week: '2024-01-08', accuracy: 0.65 },
  { week: '2024-01-15', accuracy: 0.63 },
  { week: '2024-01-22', accuracy: 0.68 },
];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  if (SUPABASE_URL && SUPABASE_KEY) {
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await client
      .from('accuracy_history')
      .select('week, accuracy')
      .order('week', { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ data: data as WeeklyAccuracy[] });
    return;
  }

  res.status(200).json({ data: MOCK_ACCURACY_HISTORY });
}

