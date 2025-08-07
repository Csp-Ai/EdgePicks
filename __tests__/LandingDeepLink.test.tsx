import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import Home from '../pages/index';

jest.mock('../components/PickSummary', () => () => <div />);
jest.mock('../components/AgentNodeGraph', () => () => <div />);
jest.mock('../components/AgentRationalePanel', () => () => <div />);
jest.mock('../components/ConfidenceMeter', () => () => <div />);

jest.mock('next/router', () => ({
  useRouter() {
    return { push: jest.fn(), query: { league: 'NFL', gameId: '1' } } as any;
  },
}));

describe('Landing deep link', () => {
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
});
