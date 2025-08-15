import { toGraph } from '@/components/universal/mapAgentEventsToGraph';
import type { AgentEvent } from '@/components/universal/UniversalAgentInterface';

describe('mapAgentEventsToGraph', () => {
  it('creates edges based on sequential agent execution', () => {
    const events: AgentEvent[] = [
      { id: '1', agent: 'A', status: 'running', t: 0 },
      { id: '2', agent: 'A', status: 'completed', t: 1 },
      { id: '3', agent: 'B', status: 'running', t: 2 },
      { id: '4', agent: 'B', status: 'completed', t: 3 },
      { id: '5', agent: 'C', status: 'running', t: 4 },
      { id: '6', agent: 'C', status: 'completed', t: 5 },
    ];

    const { edges } = toGraph(events);
    expect(edges).toEqual([
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'B-C', source: 'B', target: 'C' },
    ]);
  });

  it('creates edges from explicit dependencies when present', () => {
    const events: AgentEvent[] = [
      { id: '1', agent: 'A', status: 'running', t: 0 },
      { id: '2', agent: 'A', status: 'completed', t: 1 },
      { id: '3', agent: 'B', status: 'running', t: 2, meta: { dependsOn: 'A' } },
      { id: '4', agent: 'B', status: 'completed', t: 3 },
      { id: '5', agent: 'C', status: 'running', t: 4, meta: { dependsOn: ['A', 'B'] } },
      { id: '6', agent: 'C', status: 'completed', t: 5 },
    ];

    const { edges } = toGraph(events);
    expect(edges).toEqual([
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'A-C', source: 'A', target: 'C' },
      { id: 'B-C', source: 'B', target: 'C' },
    ]);
  });
});
