import { render, screen, fireEvent } from '@testing-library/react';
import HeroStrip from '../components/HeroStrip';

describe('HeroStrip', () => {
  it('renders CTA that anchors to games', () => {
    render(<HeroStrip />);
    const cta = screen.getByText('See live games');
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta);
    expect(window.location.hash).toBe('#games');
  });
});

