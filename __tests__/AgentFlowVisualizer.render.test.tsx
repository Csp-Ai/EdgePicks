import { render, screen } from '@testing-library/react';
import AgentFlowVisualizer from '../components/visuals/AgentFlowVisualizer';
import React from 'react';

type FlowEdge = { id: string; source: string; target: string };

describe('AgentFlowVisualizer render', () => {
  it('renders heading and appends edge under simulation', () => {
    jest.useFakeTimers();
    const original = global.EventSource;
    delete (global as any).EventSource;

    let edges: FlowEdge[] = [];
    const setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>> = (update) => {
      edges = typeof update === 'function' ? update(edges) : update;
    };

    render(<AgentFlowVisualizer setEdges={setEdges} />);
    expect(screen.getByRole('heading', { name: /agent flow/i })).toBeInTheDocument();

    jest.advanceTimersByTime(1000);
    expect(edges.length).toBeGreaterThan(0);

    global.EventSource = original;
  });
});
