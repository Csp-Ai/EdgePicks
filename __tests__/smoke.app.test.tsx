import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

function Dummy() { return <div>ok</div>; }

describe('smoke', () => {
  it('renders', () => {
    const { getByText } = render(<Dummy />);
    expect(getByText('ok')).toBeInTheDocument();
  });
});
