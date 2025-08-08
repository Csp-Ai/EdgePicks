import { render, screen, fireEvent, act } from '@testing-library/react';
import AgentLogStream from '../components/AgentLogStream';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

class MockEventSource {
  onmessage: ((ev: any) => void) | null = null;
  onerror: (() => void) | null = null;
  closed = false;
  close = jest.fn(() => {
    this.closed = true;
  });
  emit(data: any) {
    if (!this.closed && this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }
}

describe('AgentLogStream SSE', () => {
  const originalES = global.EventSource;

  beforeEach(() => {
    (global as any).EventSource = jest.fn(() => new MockEventSource());
    localStorage.clear();
  });

  afterEach(() => {
    (global as any).EventSource = originalES;
  });

  it('renders SSE messages incrementally', () => {
    render(<AgentLogStream />);
    const es = (global.EventSource as jest.Mock).mock.results[0].value as MockEventSource;
    act(() => {
      es.emit({ agent: 'a1', state: 'start' });
      es.emit({ agent: 'a2', state: 'done' });
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('persists filters across refresh', () => {
    const { unmount } = render(<AgentLogStream />);
    fireEvent.change(screen.getByLabelText(/agent filter/i), {
      target: { value: 'injury' },
    });
    fireEvent.change(screen.getByLabelText(/state filter/i), {
      target: { value: 'done' },
    });
    unmount();
    render(<AgentLogStream />);
    expect(screen.getByLabelText(/agent filter/i)).toHaveValue('injury');
    expect(screen.getByLabelText(/state filter/i)).toHaveValue('done');
  });

  it('pauses and resumes stream', () => {
    render(<AgentLogStream />);
    const es1 = (global.EventSource as jest.Mock).mock.results[0]
      .value as MockEventSource;
    act(() => {
      es1.emit({ agent: 'a1', state: 's1' });
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    act(() => {
      es1.emit({ agent: 'a2', state: 's2' });
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    const es2 = (global.EventSource as jest.Mock).mock.results[1]
      .value as MockEventSource;
    act(() => {
      es2.emit({ agent: 'a3', state: 's3' });
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

