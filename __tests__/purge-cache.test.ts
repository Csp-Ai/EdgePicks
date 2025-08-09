/** @jest-environment node */

const keysMock = jest.fn();
const delMock = jest.fn();
const quitMock = jest.fn();

jest.mock('../lib/server/cache', () => ({
  getClient: async () => ({ keys: keysMock, del: delMock, quit: quitMock })
}), { virtual: true });

const { main } = require('../scripts/purge-cache');

beforeEach(() => {
  keysMock.mockReset();
  delMock.mockReset();
  quitMock.mockReset();
  process.env.NODE_ENV = 'test';
  delete process.env.ALLOW_PROD_CACHE_PURGE;
});

test('purges all keys', async () => {
  keysMock.mockResolvedValue(['a', 'b']);
  await main(['--all']);
  expect(keysMock).toHaveBeenCalledWith('*');
  expect(delMock).toHaveBeenCalledWith('a', 'b');
  expect(quitMock).toHaveBeenCalled();
});

test('purges specific key', async () => {
  keysMock.mockResolvedValue(['foo']);
  await main(['--key', 'foo']);
  expect(keysMock).toHaveBeenCalledWith('foo');
  expect(delMock).toHaveBeenCalledWith('foo');
});

test('throws in production without override', async () => {
  process.env.NODE_ENV = 'production';
  await expect(main(['--all'])).rejects.toThrow('Refusing');
});
