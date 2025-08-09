import { resolve } from 'node:path';

const FIXTURES_ROOT = resolve(process.cwd(), 'fixtures');

/**
 * Dynamically import a JSON fixture from the local fixtures directory.
 * The path is resolved relative to the `fixtures/` folder and sanitized to
 * prevent directory traversal. The loaded JSON is returned as a typed object.
 */
export async function loadFixture<T = unknown>(relativePath: string): Promise<T> {
  const withExt = relativePath.endsWith('.json') ? relativePath : `${relativePath}.json`;
  const absolute = resolve(FIXTURES_ROOT, withExt);
  if (!absolute.startsWith(FIXTURES_ROOT)) {
    throw new Error('Invalid fixture path');
  }
  const mod = await import(absolute, { assert: { type: 'json' } });
  return mod.default as T;
}
