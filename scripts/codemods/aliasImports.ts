import fs from 'node:fs';
import path from 'node:path';
import glob from 'fast-glob';

const ROOT = process.cwd();
const SRC_GLOBS = [
  'app/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx}',
  'pages/**/*.{ts,tsx}',
  'scripts/**/*.{ts,tsx}',
];

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
  const files = await glob(SRC_GLOBS, { cwd: ROOT, absolute: true });
  let changed = 0;
  for (const file of files) {
    let src = fs.readFileSync(file, 'utf8');
    let next = src;
    for (const rule of REWRITES) {
      next = next.replace(rule.from, (...args: any[]) => rule.to(args as any));
    }
    if (next !== src) {
      fs.writeFileSync(file, next);
      changed++;
      console.log('[alias-codemod] rewrote:', path.relative(ROOT, file));
    }
  }
  console.log(`[alias-codemod] done. files changed: ${changed}`);
})();
