import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrustPage from '../pages/trust';

describe('Trust & Transparency page', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders with sample data when endpoints fail', async () => {
    render(<TrustPage />);
    const notes = await screen.findAllByText(/sample data/i);
    expect(notes.length).toBeGreaterThan(0);
  });

  it('allows tab navigation via keyboard', () => {
    render(<TrustPage />);
    const auditTab = screen.getByRole('tab', { name: 'Audit' });
    fireEvent.keyDown(auditTab, { key: 'Enter' });
    expect(
      screen.getByRole('heading', { name: /recent audit activity/i })
    ).toBeInTheDocument();
  });
});
