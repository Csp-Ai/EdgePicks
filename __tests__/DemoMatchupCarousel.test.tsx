import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import DemoMatchupCarousel, { DEMO_CAROUSEL_INTERVAL } from '../components/DemoMatchupCarousel';

describe('DemoMatchupCarousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('autoplay advances slides', () => {
    const { container } = render(<DemoMatchupCarousel />);
    const first = container.querySelector('#demo-slide-0');
    const second = container.querySelector('#demo-slide-1');
    expect(first).toHaveAttribute('aria-hidden', 'false');
    act(() => {
      jest.advanceTimersByTime(DEMO_CAROUSEL_INTERVAL);
    });
    expect(second).toHaveAttribute('aria-hidden', 'false');
  });

  it('manual navigation resumes autoplay', () => {
    const { container } = render(<DemoMatchupCarousel />);
    const next = screen.getByRole('button', { name: '›' });
    fireEvent.click(next);
    const second = container.querySelector('#demo-slide-1');
    expect(second).toHaveAttribute('aria-hidden', 'false');
    act(() => {
      jest.advanceTimersByTime(DEMO_CAROUSEL_INTERVAL);
    });
    const third = container.querySelector('#demo-slide-2');
    expect(third).toHaveAttribute('aria-hidden', 'false');
  });
});
