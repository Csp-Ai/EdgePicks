import type { AgentFunc } from '../types';
import agentsMeta from './agents.json';
import { injuryScout } from './injuryScout';
import { lineWatcher } from './lineWatcher';
import { statCruncher } from './statCruncher';

export interface AgentMeta {
  name: string;
  description: string;
  type: string;
  weight: number;
  sources: string[];
}

const runners: Record<string, AgentFunc> = {
  injuryScout,
  lineWatcher,
  statCruncher,
};

export const agents = (agentsMeta as readonly AgentMeta[]).map((meta) => ({
  ...meta,
  run: runners[meta.name],
})) as const;

export type AgentDescriptor = (typeof agents)[number];
export type AgentName = AgentDescriptor['name'];
