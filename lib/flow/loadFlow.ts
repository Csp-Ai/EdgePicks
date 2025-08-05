import { promises as fs } from 'fs';
import path from 'path';
import type { AgentName } from '../types';

export interface FlowConfig {
  name: string;
  agents: AgentName[];
}

/**
 * Load a flow configuration by name from the flows directory.
 */
export async function loadFlow(flowName: string): Promise<FlowConfig> {
  const filePath = path.join(process.cwd(), 'flows', `${flowName}.json`);
  const data = await fs.readFile(filePath, 'utf8');
  const config = JSON.parse(data) as FlowConfig;
  return config;
}
