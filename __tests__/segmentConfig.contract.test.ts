import { globbySync } from 'globby';
import { readFileSync } from 'fs';
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

  test('no revalidate re-exports or wildcards in routes', () => {
    const files = globbySync(['app/**/{page,layout}.tsx']);
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      expect(src).not.toMatch(/export\s+\{\s*revalidate[^}]*\}\s*from/);
      expect(src).not.toMatch(/export\s*\*\s*from/);
    }
  });
});
