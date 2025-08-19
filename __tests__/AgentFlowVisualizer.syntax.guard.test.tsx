import React from 'react';
import { render } from '@testing-library/react';
import AgentFlowVisualizer from '../components/AgentFlowVisualizer';

jest.mock('react-force-graph-2d', () => () => <div />);

describe('AgentFlowVisualizer syntax guard', () => {
  it('renders without throwing', () => {
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (global as any).ResizeObserver = ResizeObserver;

    expect(() => render(<AgentFlowVisualizer />)).not.toThrow();
  });
});
