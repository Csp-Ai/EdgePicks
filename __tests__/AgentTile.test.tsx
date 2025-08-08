import { render, screen } from '@testing-library/react';
import AgentTile from '../components/agents/AgentTile';
import type { AccuracyPoint } from '../components/AccuracyTrend';

describe('AgentTile', () => {
  it('renders agent info and sparkline', () => {
    const history: AccuracyPoint[] = [
      { date: '2024-01-01', injuryScout: 50, overall: 55 },
      { date: '2024-01-02', injuryScout: 60, overall: 58 },
    ];
    render(
      <AgentTile
        name="injuryScout"
        purpose="Tracks player injuries"
        sampleReasoning="Players injured."
        history={history}
      />
    );
    expect(screen.getByText('InjuryScout')).toBeInTheDocument();
    expect(screen.getByText('Tracks player injuries')).toBeInTheDocument();
    expect(screen.getByText('Players injured.')).toBeInTheDocument();
    expect(screen.getByTestId('accuracy-sparkline')).toBeInTheDocument();
  });
});
