/** @jest-environment node */
import handler from '../pages/api/version';
import packageJson from '../package.json';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('version API', () => {
  it('returns version from package.json', async () => {
    const req: any = {};
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ version: packageJson.version });
  });
});
