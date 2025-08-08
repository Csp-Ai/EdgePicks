import { render, screen } from '@testing-library/react';
import AgentTrustScore, { computeVariance } from '../components/agents/AgentTrustScore';
import { AgentOutputs } from '../lib/types';

describe('computeVariance', () => {
  it('calculates variance of agent scores', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      lineWatcher: { team: 'A', score: 0.6, reason: '' },
      statCruncher: { team: 'B', score: 0.4, reason: '' },
    };
    expect(computeVariance(agents)).toBeCloseTo(0.0156, 4);
  });
});

describe('AgentTrustScore component', () => {
  it('renders agreement percent and variance', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      lineWatcher: { team: 'A', score: 0.6, reason: '' },
      statCruncher: { team: 'B', score: 0.4, reason: '' },
    };
    render(<AgentTrustScore agents={agents} />);
    expect(screen.getByText(/Agreement 98%/)).toBeInTheDocument();
    expect(screen.getByText(/Variance 0.016/)).toBeInTheDocument();
  });
});
