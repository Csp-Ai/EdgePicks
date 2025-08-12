interface AgentEvent {
  id: string;
  timestamp: string;
  type: 'message' | 'error' | 'completion';
  content: string;
  metadata?: {
    confidence?: number;
    source?: string;
    reasoning?: string;
  };
}

interface AgentEventUpdate {
  status: 'running' | 'completed' | 'error';
  output?: AgentEvent;
  error?: string;
}

export type { AgentEvent, AgentEventUpdate };
