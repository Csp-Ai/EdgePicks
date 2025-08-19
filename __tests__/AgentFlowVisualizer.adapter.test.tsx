import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import type { Adapter, AgentEvent } from '@/lib/agents/dataAdapter';

const testAdapter: Adapter = {
  async *stream() {
    const ev: AgentEvent = { type: 'edge', payload: { id: 'e1', source: 'a', target: 'b', confidence: 0.5 }, ts: 0 };
    yield ev;
  },
  async snapshot() {
    return {
      nodes: [
        { id: 'a', role: 'scout', label: 'A', confidence: 0.5 },
        { id: 'b', role: 'analyst', label: 'B', confidence: 0.5 },
      ],
      edges: [],
    };
  },
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: () => null, toString: () => '', entries: () => new URLSearchParams().entries() }),
}));

describe('AgentFlowVisualizer adapter', () => {
  it('renders one edge from adapter stream', async () => {
    const AgentFlowVisualizer = (await import('@/components/AgentFlowVisualizer')).default;
    render(<AgentFlowVisualizer adapter={testAdapter} />);
    await waitFor(() => {
      expect(screen.getByTestId('edge-count').textContent).toBe('1');
    });
  });
});

