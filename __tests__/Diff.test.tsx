import { render } from '@testing-library/react';
import Diff from '../components/agents/Diff';
import fixture from './fixtures/outputDiff.json';

describe('Diff', () => {
  it('renders side-by-side with inline highlights', () => {
    const { getByTestId } = render(<Diff left={fixture.left} right={fixture.right} />);
    const container = getByTestId('agent-output-diff');
    expect(container.querySelectorAll('span.bg-red-200').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('span.bg-green-200').length).toBeGreaterThan(0);
  });
});
