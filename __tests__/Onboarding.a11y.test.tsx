import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Onboarding from '@/components/Onboarding';

describe('Onboarding accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    (global as any).fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ hasSeen: false })
    });
  });

  it('has focusable Skip button', async () => {
    render(
      <SessionProvider session={{ user: {}, expires: '' }}>
        <Onboarding />
      </SessionProvider>
    );
    const skip = await screen.findByRole('button', { name: /skip/i });
    skip.focus();
    expect(skip).toHaveFocus();
    fireEvent.click(skip);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /skip/i })).toBeNull();
    });
  });
});
