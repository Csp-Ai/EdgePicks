import { render, screen } from '@testing-library/react';
import AgentFlowVisualizer from '../components/visuals/AgentFlowVisualizer';

describe('AgentFlowVisualizer', () => {
  it('renders status text', () => {
    render(<AgentFlowVisualizer />);
    expect(screen.getByText(/Agent Flow/)).toBeInTheDocument();
  });
});

