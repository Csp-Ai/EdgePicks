import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Onboarding from '../components/Onboarding';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Onboarding goal capture', () => {
  beforeEach(() => {
    localStorage.clear();
    (useSession as jest.Mock).mockReturnValue({ data: {}, status: 'authenticated' });
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ hasSeen: false }),
    }) as any;
  });

  it('stores selected goal locally', async () => {
    render(<Onboarding />);
    const btn = await screen.findByRole('button', { name: 'Sports Betting' });
    fireEvent.click(btn);
    expect(localStorage.getItem('userGoal')).toBe('Sports Betting');
    expect(await screen.findByText('Welcome')).toBeInTheDocument();
  });
});
