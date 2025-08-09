import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const markers = ['<<<<<<<', '=======', '>>>>>>>'];
let found = false;

function scanDir(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.next', 'archive'].includes(entry.name)) continue;
      scanDir(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (markers.some(m => line.startsWith(m))) {
          console.error(`[merge-marker-guard] Found marker in ${path.relative(repoRoot, full)}:${i + 1}`);
          found = true;
        }
      });
    }
  }
}

scanDir(repoRoot);

if (found) {
  console.error('[merge-marker-guard] Merge conflict markers detected. Failing build.');
  process.exit(1);
} else {
  console.log('[merge-marker-guard] No merge markers found.');
}
