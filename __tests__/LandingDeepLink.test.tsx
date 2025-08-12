import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import Home from '../app/(shell)/page';

jest.mock('../components/PickSummary', () => () => <div />);
jest.mock('../components/AgentNodeGraph', () => () => <div />);
jest.mock('../components/AgentRationalePanel', () => () => <div />);
jest.mock('../components/ConfidenceMeter', () => () => <div />);

jest.mock('next/router', () => ({
  useRouter() {
    return { push: jest.fn(), query: { league: 'NFL', gameId: '1' } } as any;
  },
}));

describe.skip('Landing deep link', () => {
  const originalFetch = global.fetch;
  const originalES = global.EventSource;

  beforeEach(() => {
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'uuid' },
      configurable: true,
    });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        {
          id: 'game-1', // Added missing id property
          gameId: '1',
          league: 'NFL',
          homeTeam: { name: 'A' },
          awayTeam: { name: 'B' },
          time: new Date().toISOString(),
        },
      ],
    }) as any;
    (global as any).EventSource = jest.fn(() => ({ close: jest.fn() }));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    (global as any).EventSource = originalES;
  });

  it('opens drawer and auto starts run', async () => {
    render(<Home />);
    await waitFor(() => expect(global.EventSource).toHaveBeenCalled());
    expect(await screen.findByText('A vs B')).toBeInTheDocument();
  });

  it('deep link with unknown gameId shows not found state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ json: async () => [] });
    render(<Home />);
    expect(
      await screen.findByText('Game not found.')
    ).toBeInTheDocument();
  });
});
