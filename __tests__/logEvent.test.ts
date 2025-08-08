/** @jest-environment node */
import { logEvent } from '../lib/server/logEvent';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

describe('logEvent', () => {
  it('retries on transient errors', async () => {
    const insert = jest
      .fn()
      .mockResolvedValueOnce({ error: new Error('temporary') })
      .mockResolvedValue({ error: null });

    (supabase.from as jest.Mock).mockReturnValue({ insert });

    await logEvent('test', { foo: 'bar' }, { requestId: 'req', userId: 'user' });

    expect(insert).toHaveBeenCalledTimes(2);
    expect(supabase.from).toHaveBeenCalledWith('logs');
  });
});
