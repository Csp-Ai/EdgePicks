import { render, screen } from '@testing-library/react';
import React from 'react';
import UpcomingGamesPanel from '../components/UpcomingGamesPanel';

describe('UpcomingGamesPanel', () => {
  const mockGame = {
    homeTeam: { name: 'Lakers', logo: '' },
    awayTeam: { name: 'Celtics', logo: '' },
    confidence: 70,
    history: [60],
    league: 'NBA',
    time: 'Tomorrow',
    edgePick: [],
    winner: 'Lakers',
    edgeDelta: 0.1,
    confidenceDrop: 0.05,
    disagreements: [],
  };

  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockGame],
      headers: { get: () => null },
    }) as jest.Mock;
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('hides values when hideValues is true and uses provided cardWrapper', async () => {
    const wrapperFn = jest
      .fn()
      .mockImplementation(({ children }) => (
        <div data-testid="custom-wrapper">{children}</div>
      ));

    render(<UpcomingGamesPanel hideValues cardWrapper={wrapperFn} />);

    const wrapper = await screen.findByTestId('custom-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapperFn).toHaveBeenCalled();

    expect(screen.getAllByText('??').length).toBeGreaterThan(0);
    expect(screen.queryByText('70%')).not.toBeInTheDocument();
  });
});
