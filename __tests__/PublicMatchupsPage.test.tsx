import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock dependencies before importing the component
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../lib/logUiEvent', () => ({
  logUiEvent: jest.fn(),
}));

jest.mock('../components/TeamBadge', () => () => <div />);
jest.mock('../components/ConfidenceMeter', () => () => <div />);
jest.mock('../components/AgentRationalePanel', () => () => <div />);
jest.mock('../components/LoadingShimmer', () => () => <div />);
jest.mock('../components/EmptyState', () => () => <div />);
jest.mock('../components/SignInModal', () => () => null);
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: { div: (props: any) => <div {...props}>{props.children}</div> },
}));

import PublicMatchupsPage from '../pages/matchups/public';
import { useSession } from 'next-auth/react';
import { logUiEvent } from '../lib/logUiEvent';

const mockGames = [
  {
    homeTeam: { name: 'Home1', logo: '' },
    awayTeam: { name: 'Away1', logo: '' },
    confidence: 60,
    league: 'NFL',
    time: '1 PM',
    edgePick: [],
    winner: 'Home1',
    edgeDelta: 0.1,
    confidenceDrop: 0.1,
  },
  {
    homeTeam: { name: 'Home2', logo: '' },
    awayTeam: { name: 'Away2', logo: '' },
    confidence: 55,
    league: 'NFL',
    time: '2 PM',
    edgePick: [],
    winner: 'Home2',
    edgeDelta: 0.1,
    confidenceDrop: 0.1,
  },
  {
    homeTeam: { name: 'Home3', logo: '' },
    awayTeam: { name: 'Away3', logo: '' },
    confidence: 50,
    league: 'NFL',
    time: '3 PM',
    edgePick: [],
    winner: 'Home3',
    edgeDelta: 0.1,
    confidenceDrop: 0.1,
  },
];

describe('PublicMatchupsPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Tester' } } });
    (logUiEvent as jest.Mock).mockClear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGames),
        headers: { get: () => null },
      }) as any,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('reveals cards sequentially and logs analytics events', async () => {
    render(<PublicMatchupsPage />);

    // allow fetch and initial render
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getAllByText('Collecting Stats...')).toHaveLength(3);

    // Advance through prediction tracker steps
    for (let i = 0; i < 3; i++) {
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      await act(async () => {
        await Promise.resolve();
      });
    }

    expect(logUiEvent).toHaveBeenCalledTimes(3);
    const calls = (logUiEvent as jest.Mock).mock.calls.map((c) => c[1]);
    expect(calls).toEqual([
      { revealedIndex: 0 },
      { revealedIndex: 1 },
      { revealedIndex: 2 },
    ]);

    let trackers = screen.getAllByText('Pick Ready – Click to Reveal');
    expect(trackers).toHaveLength(3);

    // Reveal first card
    act(() => {
      fireEvent.click(trackers[0]);
    });
    expect(screen.getByText('Home1')).toBeInTheDocument();
    trackers = screen.getAllByText('Pick Ready – Click to Reveal');
    expect(trackers).toHaveLength(2);
    expect(screen.queryByText('Home2')).not.toBeInTheDocument();

    // Reveal second card
    act(() => {
      fireEvent.click(trackers[0]);
    });
    expect(screen.getByText('Home2')).toBeInTheDocument();
    trackers = screen.getAllByText('Pick Ready – Click to Reveal');
    expect(trackers).toHaveLength(1);
    expect(screen.queryByText('Home3')).not.toBeInTheDocument();

    // Reveal third card
    act(() => {
      fireEvent.click(trackers[0]);
    });
    expect(screen.getByText('Home3')).toBeInTheDocument();
    expect(screen.queryByText('Pick Ready – Click to Reveal')).toBeNull();
  });
});
