import type { Agent } from './registry';
import { registry } from './registry';
import type { AgentFunc } from '../types';

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
    guardianAgent,
  };

  return registry.map((meta) => ({
    ...meta,
    run: runners[meta.name],
  }));
}

