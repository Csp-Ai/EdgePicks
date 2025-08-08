import { render, screen, fireEvent } from '@testing-library/react';
import HeroStrip from '../components/HeroStrip';

describe('HeroStrip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const target = document.createElement('section');
    target.id = 'live-games';
    target.scrollIntoView = jest.fn();
    target.focus = jest.fn();
    document.body.appendChild(target);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('renders CTA and scrolls to live games', () => {
    const target = document.getElementById('live-games') as any;
    render(<HeroStrip />);
    const cta = screen.getByRole('button', { name: 'See live games' });
    fireEvent.click(cta);
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    jest.runAllTimers();
    expect(target.focus).toHaveBeenCalled();
  });
});

