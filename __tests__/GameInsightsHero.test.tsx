import { render, screen, fireEvent } from '@testing-library/react';
import GameInsightsHero from '../components/GameInsightsHero';

describe('GameInsightsHero', () => {
  const sampleGames = Array.from({ length: 6 }).map((_, i) => ({
    id: String(i),
    home: `Home ${i}`,
    away: `Away ${i}`,
    kickoff: new Date().toISOString(),
    spread: -3.5,
    total: 42.5,
  }));

  it('renders with 6 games', () => {
    render(<GameInsightsHero games={sampleGames} />);
    expect(screen.getAllByTestId('game-item')).toHaveLength(6);
  });

  it('loading state shows skeletons and no undefined', () => {
    render(<GameInsightsHero isLoading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/undefined/i)).toBeNull();
  });

  it('shows empty state when no games', () => {
    render(<GameInsightsHero games={[]} />);
    expect(screen.getByText('No upcoming games.')).toBeInTheDocument();
  });

  it('button calls onSeeAgents', () => {
    const onSeeAgents = jest.fn();
    render(<GameInsightsHero games={sampleGames} onSeeAgents={onSeeAgents} />);
    fireEvent.click(screen.getByRole('button', { name: 'See agents in action' }));
    expect(onSeeAgents).toHaveBeenCalled();
  });

  it('shows error state when fetch fails', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ ok: false } as Response) as any;
    render(<GameInsightsHero />);
    expect(
      await screen.findByText('Failed to load upcoming games.'),
    ).toBeInTheDocument();
    global.fetch = originalFetch;
  });
});

