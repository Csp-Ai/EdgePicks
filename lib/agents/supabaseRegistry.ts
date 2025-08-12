import { z } from 'zod';
import { supabase } from '../db';
import { cache } from '../server/cache';

const SupabaseAgentMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
  enabled: z.boolean(),
  desc: z.string().nullable(),
});

export type SupabaseAgentMeta = z.infer<typeof SupabaseAgentMetaSchema>;
export type SupabaseRegistry = Map<string, SupabaseAgentMeta>;

export type Result<T> = { ok: true; data: T } | { ok: false; error: Error };

async function fetchAgents(): Promise<Result<SupabaseRegistry>> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('id, name, weight, enabled, desc');

    if (error) {
      console.error('agent registry fetch error', error);
      return { ok: false, error };
    }

    const parsed = SupabaseAgentMetaSchema.array().safeParse(data ?? []);
    if (!parsed.success) {
      return { ok: false, error: new Error(parsed.error.message) };
    }

    const map: SupabaseRegistry = new Map(
      parsed.data.map((a) => [a.id, a]),
    );
    return { ok: true, data: map };
  } catch (err) {
    console.error('agent registry fetch error', err);
    return { ok: false, error: err as Error };
  }
}

export const getSupabaseAgentRegistry: () => Promise<Result<SupabaseRegistry>> = cache(fetchAgents);
