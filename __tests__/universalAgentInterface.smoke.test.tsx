import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UniversalAgentInterface from '../components/universal/UniversalAgentInterface';

describe('UniversalAgentInterface', () => {
  it('streams demo events and announces via aria-live', async () => {
    const { container } = render(<UniversalAgentInterface />);
    fireEvent.click(screen.getAllByRole('button', { name: /run/i })[0]);
    const liveRegion = container.querySelector('[aria-live]');
    await waitFor(() => {
      expect(liveRegion?.textContent).toMatch(/InjuryScout/);
    });
  });
});
