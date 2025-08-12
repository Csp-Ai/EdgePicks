import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import UpcomingGamesGrid from '../components/UpcomingGamesGrid';
import type { Game } from '../lib/types';

const games: Game[] = [
  {
    id: 'game-1', // Added missing id property
    gameId: '1',
    league: 'NFL',
    homeTeam: 'Lakers',
    awayTeam: 'Celtics',
    time: new Date().toISOString(),
  },
  {
    id: 'game-2', // Added missing id property
    gameId: '2',
    league: 'NFL',
    homeTeam: 'Bulls',
    awayTeam: 'Heat',
    time: new Date().toISOString(),
  },
];

describe('UpcomingGamesGrid', () => {
  it('shows skeletons', () => {
    render(
      <UpcomingGamesGrid games={[]} isLoading onSelect={jest.fn()} />
    );
    expect(screen.getAllByTestId('game-skeleton').length).toBe(6);
  });

  it('filters by search and handles click', () => {
    const onSelect = jest.fn();
    render(<UpcomingGamesGrid games={games} search="lake" onSelect={onSelect} />);
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.queryByText('Bulls')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Lakers'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows empty state when no games match search', () => {
    render(<UpcomingGamesGrid games={games} search="xyz" onSelect={jest.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('error retry calls fetch again', () => {
    const onRetry = jest.fn();
    render(
      <UpcomingGamesGrid
        games={[]}
        isError
        onRetry={onRetry}
        onSelect={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalled();
  });
});
