import type { AgentMeta } from './registry';
import { registry } from './registry';
import type { AgentResult, Matchup } from '../types';

type AgentFunc = (matchup: Matchup) => Promise<AgentResult>;
type Agent = AgentMeta & { run: AgentFunc };

export async function loadAgents(): Promise<Agent[]> {
  const [{ injuryScout }, { lineWatcher }, { statCruncher }, { trendsAgent }, { guardianAgent }] = await Promise.all([
    import('./injuryScout'),
    import('./lineWatcher'),
    import('./statCruncher'),
    import('./trendsAgent'),
    import('./guardianAgent'),
  ]);

  const runners: Record<string, AgentFunc> = {
    injuryScout,
    lineWatcher,
    statCruncher,
    trendsAgent,
    guardianAgent: guardianAgent as unknown as AgentFunc,
  };

  return registry.map((meta) => ({
    ...meta,
    run: runners[meta.name],
  }));
}

