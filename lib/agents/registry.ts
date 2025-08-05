import type { AgentFunc } from '../types';
import { injuryScout } from './injuryScout';
import { lineWatcher } from './lineWatcher';
import { statCruncher } from './statCruncher';

export interface AgentDescriptor {
  name: string;
  weight: number;
  run: AgentFunc;
}

export const agents = [
  { name: 'injuryScout', weight: 0.5, run: injuryScout },
  { name: 'lineWatcher', weight: 0.3, run: lineWatcher },
  { name: 'statCruncher', weight: 0.2, run: statCruncher },
] as const satisfies readonly AgentDescriptor[];

export type AgentName = (typeof agents)[number]['name'];
