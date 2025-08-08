import { registerSW, unregisterSW } from '../lib/sw/registerSW';

describe('service worker registration', () => {
  let original: any;

  beforeEach(() => {
    original = (navigator as any).serviceWorker;
    const mockSW = {
      register: jest.fn().mockResolvedValue(undefined),
      getRegistrations: jest.fn().mockResolvedValue([{ unregister: jest.fn() }]),
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockSW,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: original,
      configurable: true,
    });
  });

  test('registers when called', async () => {
    await registerSW();
    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
  });

  test('unregister removes existing registrations', async () => {
    const reg = { unregister: jest.fn() };
    (navigator.serviceWorker.getRegistrations as jest.Mock).mockResolvedValue([reg]);
    await unregisterSW();
    expect(reg.unregister).toHaveBeenCalled();
  });
});
