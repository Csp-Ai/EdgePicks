/** @jest-environment node */

jest.mock('../lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

describe('telemetry logger', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
  });

  it('logs to console in development', async () => {
    process.env.NODE_ENV = 'development';
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const { logEvent } = await import('../lib/telemetry/logger');
    await logEvent({ level: 'info', name: 'test', meta: { foo: 'bar' } });
    expect(infoSpy).toHaveBeenCalledWith('[test]', { foo: 'bar' });
    const { supabase } = await import('../lib/supabaseClient');
    expect(supabase.from).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it('logs to supabase in production', async () => {
    process.env.NODE_ENV = 'production';
    const { supabase } = await import('../lib/supabaseClient');
    const insert = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({ insert });
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const { logEvent } = await import('../lib/telemetry/logger');
    await logEvent({ level: 'info', name: 'test', meta: { foo: 'bar' } });
    expect(supabase.from).toHaveBeenCalled();
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'info', name: 'test', meta: { foo: 'bar' } }),
    );
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

