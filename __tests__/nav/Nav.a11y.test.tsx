import { render, screen } from '@testing-library/react';
import Nav from '@/components/ui/nav';

jest.mock('next/navigation', () => ({
  usePathname: () => '/about'
}));

describe('Nav a11y', () => {
  it('marks current route with aria-current="page"', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
