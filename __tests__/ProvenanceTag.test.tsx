import { render, screen } from '@testing-library/react';
import ProvenanceTag from '../components/predictions/ProvenanceTag';

describe('ProvenanceTag', () => {
  it('displays prediction provenance info', () => {
    render(
      <ProvenanceTag mode="demo" freshness="cached" dataAge="5m" />
    );
    expect(screen.getByText(/demo/i)).toBeInTheDocument();
    expect(screen.getByText(/cached/i)).toBeInTheDocument();
    expect(screen.getByText(/5m/i)).toBeInTheDocument();
  });
});

