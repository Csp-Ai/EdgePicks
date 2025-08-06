import { renderHook, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import usePredictionReveal from '../../lib/hooks/usePredictionReveal';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('usePredictionReveal', () => {
  afterEach(() => {
    (useSession as jest.Mock).mockReset();
  });

  it('reveals index when session exists', () => {
    (useSession as jest.Mock).mockReturnValue({ data: {} });
    const { result } = renderHook(() => usePredictionReveal());
    act(() => result.current.handleReveal(1));
    expect(result.current.revealed[1]).toBe(true);
    expect(result.current.showModal).toBe(false);
  });

  it('shows modal when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    const { result } = renderHook(() => usePredictionReveal());
    act(() => result.current.handleReveal(2));
    expect(result.current.revealed[2]).toBeUndefined();
    expect(result.current.showModal).toBe(true);
    act(() => result.current.closeModal());
    expect(result.current.showModal).toBe(false);
  });
});
