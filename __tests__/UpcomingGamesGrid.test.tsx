import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import UpcomingGamesGrid from '../components/UpcomingGamesGrid';
import type { Game } from '../lib/types';

const games: Game[] = [
  {
    gameId: '1',
    league: 'NFL',
    homeTeam: 'Lakers',
    awayTeam: 'Celtics',
    time: new Date().toISOString(),
  },
  {
    gameId: '2',
    league: 'NFL',
    homeTeam: 'Bulls',
    awayTeam: 'Heat',
    time: new Date().toISOString(),
  },
];

describe('UpcomingGamesGrid', () => {
  it('filters by search and handles click', () => {
    const onSelect = jest.fn();
    render(<UpcomingGamesGrid games={games} search="lake" onSelect={onSelect} />);
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.queryByText('Bulls')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Lakers'));
    expect(onSelect).toHaveBeenCalled();
  });
});
