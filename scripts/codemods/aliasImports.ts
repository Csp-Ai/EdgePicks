import fs from 'node:fs';
import path from 'node:path';
type Globber = (patterns: string | string[], options?: { ignore?: string[]; cwd?: string }) => string[];

// Resolves a glob function. Prefers fast-glob if available; falls back to globSync.
async function resolveGlob(): Promise<Globber> {
  try {
    // Prefer fast-glob if present
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - types optional at build time
    const mod = await import('fast-glob');
    const fg: any = (mod as any).default ?? mod;
    return (patterns, opts) => fg.sync(patterns, { dot: false, ...opts });
  } catch {
    try {
      const mod = await import('glob');
      const { globSync } = (mod as any);
      return (patterns, opts) =>
        globSync(patterns, {
          nodir: true,
          dot: false,
          cwd: opts?.cwd ?? process.cwd(),
          ignore: opts?.ignore,
        }) as string[];
    } catch {
      // Neither fast-glob nor glob is available: no-op but succeed
      console.log('[alias-codemod] glob library not found; skipping.');
      return () => [];
    }
  }
}

const ROOT = process.cwd();
const REWRITES: Array<{from: RegExp, to: (m: RegExpExecArray)=>string}> = [
  // ../../lib/foo -> @/lib/foo
  { from: /(['"])((?:\.\.\/)+)lib\/([A-Za-z0-9/_-]+)\1/g, to: m => `'@/lib/${m[3]}'` },
  // ../../components/foo -> @/components/foo
  { from: /(['"])((?:\.\.\/)+)components\/([A-Za-z0-9/_-]+)\1/g, to: m => `'@/components/${m[3]}'` },
  // ../../app/foo -> @/app/foo (rare but normalize)
  { from: /(['"])((?:\.\.\/)+)app\/([A-Za-z0-9/_-]+)\1/g, to: m => `'@/app/${m[3]}'` },
  // ../../lib/... from paths like src/* if any
];

(async () => {
  const glob = await resolveGlob();
  const files = glob(
    ['**/*.{ts,tsx,js,jsx}'],
    {
      ignore: [
        'node_modules/**',
        '.next/**',
        '.vercel/**',
        'public/**',
        'coverage/**',
        'dist/**',
        'build/**',
      ],
    },
  );
  let changed = 0;
  for (const file of files) {
    const filePath = path.join(ROOT, file);
    let src = fs.readFileSync(filePath, 'utf8');
    let next = src;
    for (const rule of REWRITES) {
      next = next.replace(rule.from, (...args: any[]) => rule.to(args as any));
    }
    if (next !== src) {
      fs.writeFileSync(filePath, next);
      changed++;
      console.log('[alias-codemod] rewrote:', path.relative(ROOT, filePath));
    }
  }
  console.log(`[alias-codemod] done. files changed: ${changed}`);
})();
