import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import AgentFlowVisualizer from '@/components/AgentFlowVisualizer';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error override for test
global.ResizeObserver = ResizeObserver;
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

describe('AgentFlowVisualizer', () => {
  it('mounts without crashing', async () => {
    render(<AgentFlowVisualizer />);
    expect(await screen.findByRole('button', { name: /reset/i })).toBeInTheDocument();
  });
});
