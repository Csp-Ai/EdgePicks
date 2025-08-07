export interface AgentLog {
  output?: any;
  durationMs?: number;
  error?: string;
}

const agentLogs: Record<string, AgentLog> = {};

export function writeAgentLog(
  sessionId: string,
  agentId: string,
  data: AgentLog
) {
  agentLogs[`${sessionId}:${agentId}`] = data;
}

export function readAgentLog(sessionId: string, agentId: string): AgentLog | undefined {
  return agentLogs[`${sessionId}:${agentId}`];
}
