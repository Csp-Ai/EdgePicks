import fs from 'fs';
import path from 'path';

export interface AgentReflection {
  whatIObserved: string;
  whatIChose: string;
  whatCouldImprove: string;
}

const filePath = path.join(process.cwd(), 'agent-reflections.json');

export function writeAgentReflection(agent: string, reflection: AgentReflection) {
  let data: Record<string, AgentReflection> = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    // ignore
  }
  data[agent] = reflection;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readAgentReflections(): Record<string, AgentReflection> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, AgentReflection>;
  } catch {
    return {};
  }
}
