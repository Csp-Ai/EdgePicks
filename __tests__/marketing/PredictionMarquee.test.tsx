import { render, screen } from '@testing-library/react';
import PredictionMarquee from '../../components/marketing/PredictionMarquee';

describe('PredictionMarquee', () => {
  it('renders demo predictions by default', () => {
    render(<PredictionMarquee />);
    expect(screen.getAllByText(/Jets \+3\.5/).length).toBeGreaterThan(0);
  });

  it('renders provided predictions', () => {
    const predictions = [
      { matchup: 'A vs B', pick: 'Pick A', confidence: 55 },
      { matchup: 'C vs D', pick: 'Pick B', confidence: 60 },
    ];
    render(<PredictionMarquee predictions={predictions} />);
    expect(screen.getAllByText('Pick A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pick B').length).toBeGreaterThan(0);
  });
});
