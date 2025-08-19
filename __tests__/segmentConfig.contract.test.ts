jest.mock('next/navigation', () => ({}));

describe('segment config contract', () => {
  test('marketing page uses ISR', () => {
    const mod = require('../app/(marketing)/page.tsx');
    expect(mod.revalidate).toBe(60);
    expect(mod.dynamic).toBe('auto');
  });

  test('product page is dynamic', () => {
    const mod = require('../app/(product)/predictions/page.tsx');
    expect(mod.revalidate).toBe(0);
    expect(mod.dynamic).toBe('force-dynamic');
  });
});
