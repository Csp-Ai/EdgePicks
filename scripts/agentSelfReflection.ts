import fs from 'fs/promises';
import path from 'path';

interface AgentOutcome {
  agent_id: string;
  correct: boolean;
  confidence: number;
  opponent?: string;
  team?: string;
  spread?: number;
  kickoff?: string;
  [key: string]: any;
}

export interface AgentReflection {
  agentId: string;
  windowDays: number;
  correctPct: number;
  samples: number;
  avgConfCorrect: number;
  avgConfWrong: number;
  commonFailureModes: string[];
  changeHints: string[];
  weightNow?: number;
  timestamp: string;
  inputsPreview?: Record<string, any>;
  summary?: string;
}

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export async function loadOutcomes(windowDays: number, live: boolean): Promise<AgentOutcome[]> {
  if (!live) {
    const fixture = path.join(process.cwd(), '__tests__', 'fixtures', 'agent_outcomes.json');
    const raw = await fs.readFile(fixture, 'utf8');
    return JSON.parse(raw) as AgentOutcome[];
  }
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return [];
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('agent_outcomes')
    .select('*')
    .gte('created_at', since);
  return (data || []) as AgentOutcome[];
}

export function computeReflections(
  outcomes: AgentOutcome[],
  opts: { windowDays: number; weights?: Record<string, number>; timestamp?: string } = { windowDays: 14 },
): Record<string, AgentReflection> {
  const groups: Record<string, AgentOutcome[]> = {};
  outcomes.forEach((o) => {
    (groups[o.agent_id] ||= []).push(o);
  });
  const result: Record<string, AgentReflection> = {};
  for (const [agentId, list] of Object.entries(groups)) {
    const correct = list.filter((l) => l.correct);
    const wrong = list.filter((l) => !l.correct);
    const correctPct = list.length ? (correct.length / list.length) * 100 : 0;
    const avgConfCorrect = avg(correct.map((c) => c.confidence));
    const avgConfWrong = avg(wrong.map((c) => c.confidence));
    const failureCounts: Record<string, number> = {};
    wrong.forEach((w) => {
      const key = w.opponent || w.team || 'unknown';
      failureCounts[key] = (failureCounts[key] || 0) + 1;
    });
    const topFailure = Object.entries(failureCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => `Issues vs ${k}`);
    const changeHints = [] as string[];
    if (avgConfWrong > avgConfCorrect) {
      changeHints.push('Calibrate confidence on misses');
    }
    const reflection: AgentReflection = {
      agentId,
      windowDays: opts.windowDays,
      correctPct: Number(correctPct.toFixed(2)),
      samples: list.length,
      avgConfCorrect: Number(avgConfCorrect.toFixed(2)),
      avgConfWrong: Number(avgConfWrong.toFixed(2)),
      commonFailureModes: topFailure.slice(0, 3),
      changeHints,
      weightNow: opts.weights ? opts.weights[agentId] : undefined,
      timestamp: opts.timestamp || new Date().toISOString(),
      inputsPreview: list[0] ? { team: list[0].team, opponent: list[0].opponent } : undefined,
    };
    if (process.env.DOCS_SELF_REFLECT !== 'off') {
      reflection.summary =
        `Over last ${reflection.windowDays} days, accuracy was ${reflection.correctPct.toFixed(
          1,
        )}%. ` +
        (reflection.commonFailureModes[0] || 'No notable failures.');
    }
    result[agentId] = reflection;
  }
  return result;
}

export async function run(): Promise<void> {
  const windowDays = Number(process.env.SELF_REFLECTION_WINDOW_DAYS || '14');
  const live = process.env.LIVE_MODE === 'on';
  const outcomes = await loadOutcomes(windowDays, live);
  let weights: Record<string, number> | undefined;
  if (process.env.WEIGHTS_DYNAMIC === 'on') {
    const mod = await import('@/lib/weights');
    weights = await mod.getDynamicWeights();
  }
  const timestamp = process.env.FREEZE_TIME || new Date().toISOString();
  const reflections = computeReflections(outcomes, { windowDays, weights, timestamp });
  for (const [agentId, refl] of Object.entries(reflections)) {
    const dir = path.join(process.cwd(), 'agents', agentId);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'reflection.json'), JSON.stringify(refl, null, 2));
    if (refl.summary) {
      await fs.writeFile(path.join(dir, 'reflection.md'), refl.summary + '\n');
    }
  }
}

if (require.main === module) {
  run();
}
