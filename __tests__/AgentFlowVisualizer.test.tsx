import { render, screen } from '@testing-library/react';
import AgentFlowVisualizer from '../components/visuals/AgentFlowVisualizer';

describe('AgentFlowVisualizer', () => {
  it('renders heading', () => {
    render(<AgentFlowVisualizer />);
    expect(screen.getByRole('heading', { name: /agent flow/i })).toBeInTheDocument();
  });
});
