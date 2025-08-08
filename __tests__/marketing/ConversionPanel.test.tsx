import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConversionPanel from '../../components/marketing/ConversionPanel';

describe('ConversionPanel', () => {
  it('renders value props and CTA', () => {
    render(<ConversionPanel />);
    expect(
      screen.getByText(/ready to keep your settings/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /keep my demo settings/i })
    ).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('fires callback when CTA clicked', () => {
    const onKeep = jest.fn();
    render(<ConversionPanel onKeepSettings={onKeep} />);
    fireEvent.click(
      screen.getByRole('button', { name: /keep my demo settings/i })
    );
    expect(onKeep).toHaveBeenCalled();
  });
});
