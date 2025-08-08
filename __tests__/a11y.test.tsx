import { render, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from '../pages/index';
import LeaderboardPage from '../pages/leaderboard';

// mock heavy components
jest.mock('../components/PredictionDrawer', () => () => null);

// mock Next router
jest.mock('next/router', () => ({
  useRouter() {
    return { push: jest.fn(), query: {} } as any;
  },
}));

// mock SWR to avoid network
jest.mock('swr', () => ({
  __esModule: true,
  default: () => ({ data: [], error: null, isLoading: false }),
}));

expect.extend(toHaveNoViolations);

describe('Accessibility checks', () => {
  it('home page has no violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('leaderboard page has no violations', async () => {
    // mock fetch to return sample data
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const { container } = render(<LeaderboardPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
