// @ts-nocheck
import { supabase } from '../db';
import { cache } from '../server/cache';

export interface SupabaseAgentMeta {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
  desc: string | null;
}

async function fetchAgents(): Promise<SupabaseAgentMeta[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('id, name, weight, enabled, desc');

    if (error) {
      console.error('agent registry fetch error', error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('agent registry fetch error', err);
    return [];
  }
}

export const getSupabaseAgentRegistry = cache(fetchAgents);
