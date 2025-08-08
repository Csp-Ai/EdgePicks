import { render, screen } from '@testing-library/react';
import ProgressStepper from '../components/onboarding/ProgressStepper';

describe('ProgressStepper', () => {
  it('renders steps and highlights current', () => {
    render(<ProgressStepper total={3} current={1} />);
    const steps = screen.getAllByTestId('progress-step');
    expect(steps).toHaveLength(3);
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    expect(steps[0]).not.toHaveAttribute('aria-current');
  });
});
