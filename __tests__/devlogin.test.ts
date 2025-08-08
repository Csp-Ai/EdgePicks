/** @jest-environment node */
import handler from '../pages/api/dev-login';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('dev-login API', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.NEXT_PUBLIC_MOCK_AUTH = originalMockAuth;
  });

  it('returns mock user in development', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.NEXT_PUBLIC_MOCK_AUTH;

    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'dev-user', name: 'Dev User' });
  });

  it('returns 403 in production without mock flag', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_MOCK_AUTH;

    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('allows mock auth in production when flag set', async () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_MOCK_AUTH = '1';

    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'dev-user', name: 'Dev User' });
  });
});
