import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PredictionMarquee from '../../components/marketing/PredictionMarquee';

describe('PredictionMarquee', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders tracker in demo mode', async () => {
    render(<PredictionMarquee />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('node-injuryScout')).toHaveAttribute(
      'data-status',
      'completed',
    );
    expect(screen.getByTestId('node-lineWatcher')).toHaveAttribute(
      'data-status',
      'completed',
    );
  });

  it('buttons fire callbacks and scroll', () => {
    const onDemo = jest.fn();
    render(<PredictionMarquee onTryDemo={onDemo} />);
    fireEvent.click(screen.getByRole('button', { name: /try the demo/i }));
    expect(onDemo).toHaveBeenCalled();

    const target = document.createElement('div');
    target.id = 'live-games';
    target.scrollIntoView = jest.fn();
    document.body.appendChild(target);
    fireEvent.click(screen.getByRole('button', { name: /see upcoming games/i }));
    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it('does not shift layout significantly', () => {
    const { getByTestId } = render(<PredictionMarquee />);
    const marquee = getByTestId('prediction-marquee');
    const before = marquee.getBoundingClientRect().height;
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const after = marquee.getBoundingClientRect().height;
    expect(Math.abs(after - before)).toBeLessThan(0.1);
  });
});
