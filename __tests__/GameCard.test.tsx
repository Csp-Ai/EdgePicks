import React from 'react';
import { render, screen } from '@testing-library/react';
import GameCard from '../components/GameCard';
import type { Game } from '../lib/types';

jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} />;
});

const game: Game = {
  gameId: '1',
  league: 'NFL',
  homeTeam: 'Lakers',
  awayTeam: 'Celtics',
  time: '2023-01-01T19:20:00Z',
  homeLogo: '/home.png',
  awayLogo: '/away.png',
  kickoffDisplay: 'in 2h',
  odds: {
    spread: -3.5,
    overUnder: 45.5,
    moneyline: { home: -150, away: 130 },
    bookmaker: 'MockBook',
  },
};

describe('GameCard', () => {
  it('renders kickoff info and odds chips', () => {
    render(<GameCard game={game} onClick={jest.fn()} />);
    const absolute = new Date(game.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const kickoff = screen.getByText(/in 2h/);
    expect(kickoff).toBeInTheDocument();
    expect(kickoff.textContent).toContain(`• ${absolute}`);
    expect(screen.getByText(/Spread/)).toBeInTheDocument();
    expect(screen.getByText(/O\/U/)).toBeInTheDocument();
    expect(screen.getByText(/ML/)).toBeInTheDocument();
  });

  it('has accessible button role', () => {
    render(<GameCard game={game} onClick={jest.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
