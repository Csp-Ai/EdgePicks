import { render, screen, fireEvent } from '@testing-library/react';
import BetaRibbon from '../components/BetaRibbon';

describe('BetaRibbon', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists dismissal in localStorage', () => {
    const { rerender } = render(<BetaRibbon />);
    expect(screen.getByText(/Welcome to EdgePicks Beta/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /dismiss beta ribbon/i }));
    expect(localStorage.getItem('betaRibbonDismissed')).toBe('1');
    rerender(<BetaRibbon />);
    expect(screen.queryByText(/Welcome to EdgePicks Beta/)).toBeNull();
  });
});
