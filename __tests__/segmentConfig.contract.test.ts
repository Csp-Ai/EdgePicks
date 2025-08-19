jest.mock('next/navigation', () => ({}));

describe('segment config contract', () => {
  test('marketing layout uses ISR defaults', () => {
    const mod = require('../app/(marketing)/layout.tsx');
    expect(mod.revalidate).toBe(60);
    expect(mod.dynamic).toBe('auto');
    expect('fetchCache' in mod).toBe(false);
  });

  test('marketing page uses ISR defaults', () => {
    const mod = require('../app/(marketing)/impact/page.tsx');
    expect(mod.revalidate).toBe(60);
    expect(mod.dynamic).toBe('auto');
    expect('fetchCache' in mod).toBe(false);
  });

  test('product page is fully dynamic', () => {
    const mod = require('../app/(product)/agents/page.tsx');
    expect(mod.revalidate).toBe(0);
    expect(mod.dynamic).toBe('force-dynamic');
    expect('fetchCache' in mod).toBe(false);
  });
});
