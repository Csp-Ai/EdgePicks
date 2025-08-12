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

(async () => {
  const files = await glob(SRC_GLOBS, { cwd: ROOT, absolute: true });
  const offenders: string[] = [];
  const pattern = /import\s+\{\s*useSWR\s*\}\s+from\s+['"]swr['"]/;
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    if (pattern.test(s)) offenders.push(path.relative(ROOT, f));
  }
  if (offenders.length) {
    console.error('[swr-import-guard] named useSWR imports found:');
    offenders.forEach(o => console.error(' -', o));
    process.exit(1);
  } else {
    console.log('[swr-import-guard] OK');
  }
})();
