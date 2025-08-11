import fs from 'node:fs';
import path from 'node:path';
import glob from 'fast-glob';

const ROOT = process.cwd();
const SRC_GLOBS = [
  'app/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx}',
  'pages/**/*.{ts,tsx}',
];

const BAD = [
  /from\s+['"](\.\.\/)+lib\//,
  /from\s+['"](\.\.\/)+components\//,
  /from\s+['"](\.\.\/)+app\//,
];

(async () => {
  const files = await glob(SRC_GLOBS, { cwd: ROOT, absolute: true });
  const offenders: string[] = [];
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    if (BAD.some(r => r.test(s))) offenders.push(path.relative(ROOT, f));
  }
  if (offenders.length) {
    console.error('[alias-guard] relative cross-root imports found:');
    offenders.forEach(o => console.error(' -', o));
    process.exit(1);
  } else {
    console.log('[alias-guard] OK');
  }
})();
