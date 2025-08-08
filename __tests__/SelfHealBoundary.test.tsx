import { render, screen } from '@testing-library/react';
import React from 'react';
import SelfHealBoundary from '../components/self-heal/SelfHealBoundary';

describe('SelfHealBoundary', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  afterAll(() => {
    consoleError.mockRestore();
  });

  it('shows fix suggestions chip when child throws', () => {
    const Thrower = () => {
      throw new Error('boom');
    };

    render(
      <SelfHealBoundary>
        <Thrower />
      </SelfHealBoundary>
    );

    const link = screen.getByRole('link', { name: /fix suggestions/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/.github/PULL_REQUEST_TEMPLATE.md');
  });
});
