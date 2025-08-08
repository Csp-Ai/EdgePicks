import { render, screen, fireEvent } from '@testing-library/react';
import DisagreementBadge, { computeDisagreement } from '../components/agents/DisagreementBadge';
import type { AgentOutputs } from '../lib/types';

describe('computeDisagreement', () => {
  it('calculates fraction of agents not in majority', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      lineWatcher: { team: 'A', score: 0.6, reason: '' },
      statCruncher: { team: 'B', score: 0.4, reason: '' },
    };
    expect(computeDisagreement(agents)).toBeCloseTo(1 / 3, 5);
  });
});

describe('DisagreementBadge component', () => {
  it('renders badge with disagreement percent', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      lineWatcher: { team: 'A', score: 0.6, reason: '' },
      statCruncher: { team: 'B', score: 0.4, reason: '' },
    };
    render(<DisagreementBadge agents={agents} />);
    expect(screen.getByText('33% disagree')).toBeInTheDocument();
  });

  it('shows agent picks in tooltip on hover', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      statCruncher: { team: 'B', score: 0.4, reason: '' },
    };
    render(<DisagreementBadge agents={agents} />);
    const badge = screen.getByText(/disagree/);
    fireEvent.mouseEnter(badge);
    expect(screen.getByText('InjuryScout: A')).toBeInTheDocument();
    expect(screen.getByText('StatCruncher: B')).toBeInTheDocument();
  });

  it('renders nothing when there is no disagreement', () => {
    const agents: Partial<AgentOutputs> = {
      injuryScout: { team: 'A', score: 0.7, reason: '' },
      lineWatcher: { team: 'A', score: 0.6, reason: '' },
    };
    const { container } = render(<DisagreementBadge agents={agents} />);
    expect(container.firstChild).toBeNull();
  });
});
