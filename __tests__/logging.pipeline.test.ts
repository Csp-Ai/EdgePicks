/** @jest-environment node */
import { logUiEvent } from '../lib/logUiEvent';
import { logToSupabase, getLogStatus, flushLogQueue } from '../lib/logToSupabase';
import { setQueueDriver } from '../lib/infra/queue';
import { MemoryQueueDriver } from '../lib/infra/queue/memory';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

describe('logging pipeline', () => {
  beforeEach(() => {
    setQueueDriver(new MemoryQueueDriver());
    const insert = jest
      .fn()
      .mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: { id: '1' }, error: null }) }) });
    (supabase.from as jest.Mock).mockReturnValue({ insert });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('logs ui and agent events with correlation id', async () => {
    const correlationId = 'cid-123';
    await logUiEvent('click', { x: 1 }, correlationId);
    logToSupabase('agent_events', {
      agent_id: 'a1',
      event: 'result',
      metadata: { y: 2 },
      correlation_id: correlationId,
      created_at: new Date().toISOString(),
    });
    await flushLogQueue();
    expect(supabase.from).toHaveBeenCalledWith('ui_events');
    expect(supabase.from).toHaveBeenCalledWith('agent_events');
    const status = await getLogStatus();
    expect(status.pending).toBe(0);
  });
});
