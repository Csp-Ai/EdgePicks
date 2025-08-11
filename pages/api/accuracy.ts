import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { recomputeAccuracy } from '@/lib/accuracy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { matchupId, actualWinner } = req.body as {
      matchupId?: string;
      actualWinner?: string;
    };
    if (!matchupId || !actualWinner) {
      res.status(400).json({ error: 'matchupId and actualWinner are required' });
      return;
    }

    const { error } = await supabase
      .from('matchups')
      .update({ actual_winner: actualWinner })
      .eq('id', matchupId);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    try {
      await recomputeAccuracy();
    } catch (err: any) {
      console.error('recomputeAccuracy failed', err);
    }

    res.status(200).json({ success: true });
    return;
  }

  if (req.method === 'GET') {
    const { data: agentRows, error: agentError } = await supabase
      .from('agent_stats')
      .select('*')
      .order('accuracy', { ascending: false });
    const { data: flowRows, error: flowError } = await supabase
      .from('flow_stats')
      .select('*')
      .order('accuracy', { ascending: false });
    if (agentError || flowError) {
      res
        .status(500)
        .json({ error: agentError?.message || flowError?.message });
      return;
    }

    res.status(200).json({
      agents: (agentRows || []).map((r) => ({
        name: r.agent,
        wins: r.wins,
        losses: r.losses,
        accuracy: r.accuracy,
      })),
      flows: (flowRows || []).map((r) => ({
        name: r.flow,
        wins: r.wins,
        losses: r.losses,
        accuracy: r.accuracy,
      })),
    });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}

