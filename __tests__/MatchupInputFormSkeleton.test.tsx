import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchupInputFormSkeleton from '../components/skeletons/MatchupInputFormSkeleton';

describe('MatchupInputFormSkeleton', () => {
  it('renders skeleton fields and button with aria-busy', () => {
    render(<MatchupInputFormSkeleton />);
    expect(screen.getByTestId('matchup-form-skeleton')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByTestId('field-skeleton').length).toBe(3);
    expect(screen.getByTestId('button-skeleton')).toBeInTheDocument();
  });
});
