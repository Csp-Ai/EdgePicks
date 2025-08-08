import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AuditLogList from '../components/AuditLogList';

describe('AuditLogList', () => {
  const logs = {
    logs: [
      {
        id: '1',
        timestamp: '2025-01-01',
        type: 'policy',
        severity: 'info',
        message: 'test message',
        details: 'more info',
      },
    ],
    total: 1,
  };

  function setup() {
    const fetchMock = jest.fn().mockResolvedValue({ json: () => Promise.resolve(logs) });
    (global as any).fetch = fetchMock;
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AuditLogList />
      </SWRConfig>
    );
    return fetchMock;
  }

  it('renders logs and opens modal', async () => {
    setup();
    expect(await screen.findByText('test message')).toBeInTheDocument();
    fireEvent.click(screen.getByText('test message'));
    expect(screen.getByRole('dialog')).toHaveTextContent('more info');
  });

  it('updates query when type filter changes', async () => {
    const fetchMock = setup();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve(logs) });
    fireEvent.change(screen.getByLabelText(/filter by type/i), { target: { value: 'action' } });
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith('/api/audit-logs?page=1&type=action');
    });
  });
});

