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
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('returns mock user in development', async () => {
    process.env.NODE_ENV = 'development';

    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'dev-user', name: 'Dev User' });
  });

  it('returns 404 outside development', async () => {
    process.env.NODE_ENV = 'production';

    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalled();
  });
});
