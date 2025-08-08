import { render, screen } from '@testing-library/react';
import React from 'react';
import ReplayPage from '../pages/replay/[runId]';
import events from '../fixtures/replay/agent-events.json';

jest.mock('next/router', () => ({
  useRouter() {
    return { query: { runId: 'demo' } } as any;
  },
}));

describe('ReplayPage', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => events,
    });
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders agent event timeline', async () => {
    render(<ReplayPage />);
    expect(await screen.findByText(/Healthy lineup/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/api/agent-events?runId=demo');
  });
});
