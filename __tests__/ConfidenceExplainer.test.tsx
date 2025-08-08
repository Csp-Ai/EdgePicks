import { render, screen } from '@testing-library/react';
import ConfidenceExplainer from '../components/predictions/ConfidenceExplainer';

describe('ConfidenceExplainer', () => {
  it('describes high confidence and solid edge', () => {
    render(<ConfidenceExplainer confidence={0.9} edge={0.12} />);
    expect(screen.getByText(/highly confident/i)).toBeInTheDocument();
    expect(screen.getByText(/12% edge/i)).toBeInTheDocument();
    expect(screen.getByText(/bet responsibly/i)).toBeInTheDocument();
  });

  it('describes low confidence and minimal edge', () => {
    render(<ConfidenceExplainer confidence={0.4} edge={0.02} />);
    expect(screen.getByText(/uncertain/i)).toBeInTheDocument();
    expect(screen.getByText(/2% edge/i)).toBeInTheDocument();
  });
});

