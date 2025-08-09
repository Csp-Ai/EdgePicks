import { render, screen, fireEvent, act } from '@testing-library/react';
import RunTimeline from '../components/agents/RunTimeline';

jest.useFakeTimers();

describe('RunTimeline', () => {
  it('plays, pauses, and replays using mock events', () => {
    render(<RunTimeline />);

    expect(screen.queryAllByTestId('past-event')).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: /^play$/i }));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryAllByTestId('past-event')).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryAllByTestId('past-event')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /^pause$/i }));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryAllByTestId('past-event')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /^replay$/i }));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryAllByTestId('past-event')).toHaveLength(1);
  });
});

