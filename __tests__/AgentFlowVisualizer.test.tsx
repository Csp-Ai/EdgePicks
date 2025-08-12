import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import AgentFlowVisualizer from '../components/visuals/AgentFlowVisualizer';

describe('AgentFlowVisualizer', () => {
  it('renders heading', () => {
    const setEdges = jest.fn();
    render(<AgentFlowVisualizer setEdges={setEdges} />);
    expect(screen.getByRole('heading', { name: /agent flow/i })).toBeInTheDocument();
  });
});
