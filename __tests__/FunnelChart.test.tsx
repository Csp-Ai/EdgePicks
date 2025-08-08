import { render, screen } from '@testing-library/react';
import FunnelChart, { FunnelDatum } from '../components/analytics/FunnelChart';

const data: FunnelDatum[] = [
  { name: 'Demo', value: 10 },
  { name: 'Replay', value: 5 },
  { name: 'Onboarding 1', value: 3 },
];

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
});

describe('FunnelChart', () => {
  it('renders labels for steps', () => {
    render(<FunnelChart data={data} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText('Replay')).toBeInTheDocument();
  });
});
