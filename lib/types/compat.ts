import type { AgentOutputs } from "../types";
export type AgentKey = keyof AgentOutputs;
export function getAgent<T extends AgentKey>(o: Partial<AgentOutputs>, k: T) {
  return o[k];
}
