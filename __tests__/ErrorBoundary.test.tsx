import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/sys/ErrorBoundary';
import withBoundary from '../components/sys/withBoundary';
import React from 'react';

describe('ErrorBoundary', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  afterAll(() => {
    consoleError.mockRestore();
  });

  it('renders fallback when child throws', () => {
    const Thrower = () => {
      throw new Error('boom');
    };

    render(
      <ErrorBoundary fallback={<span>fallback</span>}>
        <Thrower />
      </ErrorBoundary>
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('withBoundary HOC renders default fallback', () => {
    const Thrower = () => {
      throw new Error('explode');
    };

    const Safe = withBoundary(Thrower);

    render(<Safe />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
  });
});

