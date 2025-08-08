import { render, screen, fireEvent } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AccuracyTrend, { AccuracyHistory } from '../components/AccuracyTrend';

const history = [
  { date: '2024-04-01', overall: 60, injuryScout: 50, lineWatcher: 70 },
  { date: '2024-04-08', overall: 62, injuryScout: 52, lineWatcher: 72 },
  { date: '2024-04-15', overall: 64, injuryScout: 54, lineWatcher: 74 },
  { date: '2024-04-22', overall: 66, injuryScout: 56, lineWatcher: 76 },
  { date: '2024-04-29', overall: 68, injuryScout: 58, lineWatcher: 78 },
];

const fallbackData: AccuracyHistory = { history };

let originalFetch: any;
beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
  // @ts-ignore
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  originalFetch = global.fetch;
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(fallbackData) })
  ) as any;
});

afterAll(() => {
  // @ts-ignore
  global.fetch = originalFetch;
});

describe('AccuracyTrend', () => {
  it('renders from fallbackData', () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AccuracyTrend fallbackData={fallbackData} />
      </SWRConfig>
    );
    expect(
      screen.getByRole('button', { name: 'Overall' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('point-count').textContent).toBe('5');
  });

  it('toggles change domain/timeframe', () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AccuracyTrend fallbackData={fallbackData} />
      </SWRConfig>
    );
    fireEvent.click(screen.getByRole('button', { name: '1W' }));
    expect(screen.getByTestId('point-count').textContent).toBe('2');
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByTestId('point-count').textContent).toBe('5');
  });

  it('legend is focusable and Enter toggles series', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AccuracyTrend fallbackData={fallbackData} />
      </SWRConfig>
    );
    const overallLegend = await screen.findByRole('button', { name: 'Overall' });
    overallLegend.focus();
    fireEvent.keyDown(overallLegend, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByTestId('line-overall')).toBeNull();
  });
});
