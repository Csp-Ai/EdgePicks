import type { AgentFunc } from '../types';
import agentsMeta from './agents.json';

export interface AgentMeta {
  name: string;
  description: string;
  type: string;
  weight: number;
  sources: string[];
}

export const registry: AgentMeta[] = agentsMeta as AgentMeta[];

export type AgentName = (typeof registry)[number]['name'];

export interface Agent extends AgentMeta {
  run: AgentFunc;
}

