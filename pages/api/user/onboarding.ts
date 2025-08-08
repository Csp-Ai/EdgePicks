import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = session.user.email as string;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('has_seen_onboarding')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        await supabase.from('user_profiles').insert({ user_id: userId }).single();
        res.status(200).json({ hasSeen: false });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ hasSeen: data?.has_seen_onboarding });
  } else if (req.method === 'POST') {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, has_seen_onboarding: true }, { onConflict: 'user_id' });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end('Method Not Allowed');
  }
}
