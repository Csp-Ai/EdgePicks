import { render, screen } from '@testing-library/react';
import EnvDashboard from '../components/EnvDashboard';

describe('EnvDashboard', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('renders env keys in development', () => {
    process.env.NODE_ENV = 'development';
    render(<EnvDashboard />);
    expect(screen.getByText(/^GOOGLE_CLIENT_ID/)).toBeInTheDocument();
  });

  it('renders nothing outside development', () => {
    process.env.NODE_ENV = 'production';
    const { container } = render(<EnvDashboard />);
    expect(container).toBeEmptyDOMElement();
  });
});
