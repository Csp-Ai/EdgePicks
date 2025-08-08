import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PricingTeaser from '../../components/marketing/PricingTeaser';

describe('PricingTeaser', () => {
  it('renders nothing when closed', () => {
    render(
      <PricingTeaser isOpen={false} onUpgrade={jest.fn()} onKeepDemo={jest.fn()} />
    );
    expect(screen.queryByTestId('pricing-teaser')).toBeNull();
  });

  it('shows teaser and handles interactions', () => {
    const onUpgrade = jest.fn();
    const onKeep = jest.fn();
    render(
      <PricingTeaser isOpen onUpgrade={onUpgrade} onKeepDemo={onKeep} />
    );
    expect(
      screen.getByRole('heading', { name: /unlock full access/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /upgrade now/i }));
    expect(onUpgrade).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /keep using demo/i }));
    expect(onKeep).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('pricing-teaser'));
    expect(onKeep).toHaveBeenCalledTimes(2);
  });
});
