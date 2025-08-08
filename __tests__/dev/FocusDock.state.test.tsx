import { fireEvent, render, screen } from '@testing-library/react';
import FocusDock from '../../components/dev/FocusDock';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ pathname: '/', query: {} });
  localStorage.clear();
});

test('state persists to localStorage', () => {
  const { unmount } = render(<FocusDock />);
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true, shiftKey: true });
  const titleInput = screen.getAllByRole('textbox')[0];
  fireEvent.change(titleInput, { target: { value: 'Persisted' } });
  unmount();
  const stored = JSON.parse(localStorage.getItem('edgepicks.dev.focusDock.v1') || '{}');
  expect(stored.focusTitle).toBe('Persisted');
});

test('wip guard disables start new focus', () => {
  render(<FocusDock />);
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true, shiftKey: true });
  const checklistInput = screen.getAllByRole('textbox')[1];
  fireEvent.change(checklistInput, { target: { value: 'item' } });
  const btn = screen.getByRole('button', { name: 'Start New Focus' });
  expect(btn).toBeDisabled();
});

test('hotkey Ctrl+J stashes interrupt', () => {
  render(<FocusDock />);
  fireEvent.keyDown(window, { key: 'j', ctrlKey: true });
  const textareas = screen.getAllByRole('textbox');
  const interrupt = textareas[textareas.length - 1];
  fireEvent.change(interrupt, { target: { value: 'note' } });
  fireEvent.click(screen.getByRole('button', { name: 'Stash' }));
  expect(screen.getByText(/note/)).toBeInTheDocument();
});
