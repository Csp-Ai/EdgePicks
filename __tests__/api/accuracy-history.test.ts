/** @jest-environment node */
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('GET /api/accuracy-history', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReset();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_KEY;
  });

  it('returns fixture data when Supabase env is missing', async () => {
    let handler: any, MOCK_ACCURACY_HISTORY: any;
    await jest.isolateModulesAsync(async () => {
      const mod = await import('../../pages/api/accuracy-history');
      handler = mod.default;
      MOCK_ACCURACY_HISTORY = mod.MOCK_ACCURACY_HISTORY;
    });
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    await handler({} as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ data: MOCK_ACCURACY_HISTORY });
    expect(createClient).not.toHaveBeenCalled();
  });

  it('fetches data from Supabase when env is present', async () => {
    process.env.SUPABASE_URL = 'url';
    process.env.SUPABASE_KEY = 'key';

    const order = jest
      .fn()
      .mockResolvedValue({
        data: [{ week: '2024-02-01', accuracy: 0.75 }],
        error: null,
      });
    const select = jest.fn().mockReturnValue({ order });
    const from = jest.fn().mockReturnValue({ select });
    (createClient as jest.Mock).mockReturnValue({ from });

    let handler: any;
    await jest.isolateModulesAsync(async () => {
      handler = (await import('../../pages/api/accuracy-history')).default;
    });
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    await handler({} as any, res);

    expect(createClient).toHaveBeenCalledWith('url', 'key');
    expect(from).toHaveBeenCalledWith('accuracy_history');
    expect(select).toHaveBeenCalledWith('week, accuracy');
    expect(order).toHaveBeenCalledWith('week', { ascending: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      data: [{ week: '2024-02-01', accuracy: 0.75 }],
    });
  });
});

