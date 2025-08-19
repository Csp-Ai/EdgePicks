import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import AppHeader from '@/components/AppHeader';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

describe('AppHeader', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('renders centered navigation and sign in button', () => {
    render(<AppHeader />);
    expect(screen.getByText('EdgePicks')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('justify-center');
    const btn = screen.getByRole('button', { name: 'Continue' });
    expect(btn).toHaveClass('focus-visible:ring-2');
  });

  it('hides sign in when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({ data: {}, status: 'authenticated' });
    render(<AppHeader />);
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
  });
});

