import { render, screen } from '@testing-library/react';
import Comparator from '../components/agents/Comparator';

describe('Comparator', () => {
  it('renders two agents side by side with weights and reasoning', () => {
    render(
      <Comparator
        left={{ name: 'injuryScout', weight: 0.5, reasoning: 'Player injuries affect matchup.' }}
        right={{ name: 'lineWatcher', weight: 0.3, reasoning: 'Betting lines are moving.' }}
      />
    );

    expect(screen.getByText('InjuryScout')).toBeInTheDocument();
    expect(screen.getByText('LineWatcher')).toBeInTheDocument();
    expect(screen.getByText(/Weight: 0.5/)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 0.3/)).toBeInTheDocument();
    expect(screen.getByText('Player injuries affect matchup.')).toBeInTheDocument();
    expect(screen.getByText('Betting lines are moving.')).toBeInTheDocument();
  });
});
