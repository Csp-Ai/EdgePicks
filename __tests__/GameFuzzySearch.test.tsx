import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import GameFuzzySearch from '../components/search/GameFuzzySearch';
import type { Game } from '../lib/types';

const games: Game[] = [
  {
    gameId: '1',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Celtics',
    time: new Date().toISOString(),
  },
  {
    gameId: '2',
    league: 'NBA',
    homeTeam: 'Bulls',
    awayTeam: 'Heat',
    time: new Date().toISOString(),
  },
];

describe('GameFuzzySearch', () => {
  it('filters and selects games', () => {
    const onSelect = jest.fn();
    render(<GameFuzzySearch games={games} onSelect={onSelect} />);
    const input = screen.getByPlaceholderText('Search games...');
    fireEvent.change(input, { target: { value: 'lkr' } });
    const item = screen.getByText('Lakers vs Celtics');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith(games[0]);
  });

  it('shows no results message', () => {
    render(<GameFuzzySearch games={games} onSelect={jest.fn()} />);
    const input = screen.getByPlaceholderText('Search games...');
    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });
});
