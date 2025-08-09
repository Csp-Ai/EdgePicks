import { render, screen } from '@testing-library/react';
import DataFreshness from '../components/system/DataFreshness';

describe('DataFreshness', () => {
  it('shows minutes since last update', () => {
    const lastUpdated = new Date(Date.now() - 5 * 60_000);
    render(<DataFreshness lastUpdated={lastUpdated} warnAfterMinutes={15} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Last updated 5 min ago');
    expect(status).not.toHaveTextContent('⚠️');
  });

  it('warns when data is stale', () => {
    const lastUpdated = new Date(Date.now() - 20 * 60_000);
    render(<DataFreshness lastUpdated={lastUpdated} warnAfterMinutes={15} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('⚠️');
    expect(status).toHaveTextContent('Last updated 20 min ago');
  });
});

