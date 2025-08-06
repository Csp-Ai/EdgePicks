import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import PublicMatchupsPage from '../pages/matchups/public';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../components/UpcomingGamesPanel', () => ({
  cardWrapper,
}: any) => cardWrapper({ index: 0, children: <div data-testid="game">Game</div> }));

jest.mock('../components/PredictionTracker', () => ({ onReveal }: any) => (
  <button onClick={onReveal}>Reveal</button>
));

jest.mock('../components/SignInModal', () => ({ isOpen }: any) =>
  isOpen ? <div data-testid="sign-in-modal" /> : null
);

describe('PublicMatchupsPage', () => {
  afterEach(() => {
    (useSession as jest.Mock).mockReset();
  });

  it('shows sign-in modal when revealing without session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<PublicMatchupsPage />);
    fireEvent.click(screen.getByText('Reveal'));
    expect(screen.getByTestId('sign-in-modal')).toBeInTheDocument();
  });

  it('reveals predictions when session exists', () => {
    (useSession as jest.Mock).mockReturnValue({ data: {} });
    render(<PublicMatchupsPage />);
    fireEvent.click(screen.getByText('Reveal'));
    expect(screen.getByTestId('game')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-modal')).not.toBeInTheDocument();
  });
});
