import React, { useEffect, useState } from 'react';
import { formatAgentName } from '@/lib/utils';
import type { AgentName } from '@/lib/agents/registry';

const AGENTS: AgentName[] = [
  'injuryScout',
  'lineWatcher',
  'statCruncher',
  'trendsAgent',
  'guardianAgent',
];

type AgentState = 'pending' | 'running' | 'done' | 'error';

interface AgentStatus {
  name: AgentName;
  state: AgentState;
}

interface MockEvent {
  agent: AgentName;
  state: AgentState;
}

class MockEventSource {
  private listeners: Array<(ev: MessageEvent) => void> = [];
  private timers: NodeJS.Timeout[] = [];

  constructor(private agents: AgentName[]) {
    this.start();
  }

  private start() {
    this.agents.forEach((agent) => {
      const startDelay = Math.random() * 1000 + 500;
      const endDelay = startDelay + Math.random() * 1000 + 500;

      this.timers.push(
        setTimeout(() => this.emit({ agent, state: 'running' }), startDelay)
      );
      this.timers.push(
        setTimeout(() => {
          const finalState: AgentState = Math.random() < 0.1 ? 'error' : 'done';
          this.emit({ agent, state: finalState });
        }, endDelay)
      );
    });
  }

  addEventListener(_type: 'message', listener: (ev: MessageEvent) => void) {
    this.listeners.push(listener);
  }

  private emit(data: MockEvent) {
    const event = new MessageEvent('message', {
      data: JSON.stringify(data),
    });
    this.listeners.forEach((listener) => listener(event));
  }

  close() {
    this.timers.forEach(clearTimeout);
    this.listeners = [];
  }
}

const statusStyles: Record<AgentState, string> = {
  pending: 'bg-gray-300',
  running: 'bg-blue-400 animate-pulse',
  done: 'bg-green-500',
  error: 'bg-red-500',
};

const ParallelAgentPanel: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(
    AGENTS.map((name) => ({ name, state: 'pending' }))
  );

  useEffect(() => {
    const source = new MockEventSource(AGENTS);
    const handler = (event: MessageEvent) => {
      const { agent, state } = JSON.parse(event.data) as MockEvent;
      setAgents((prev) =>
        prev.map((a) => (a.name === agent ? { ...a, state } : a))
      );
    };

    source.addEventListener('message', handler);

    return () => source.close();
  }, []);

  return (
    <div className="flex gap-4" data-testid="parallel-agent-panel">
      {agents.map((agent) => (
        <div key={agent.name} className="flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full ${statusStyles[agent.state]}`}
            aria-label={`${agent.name} state: ${agent.state}`}
          />
          <span className="text-xs mt-1">{formatAgentName(agent.name)}</span>
        </div>
      ))}
    </div>
  );
};

export default ParallelAgentPanel;
