import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BAD = ['<<<<<<<', '=======', '>>>>>>>'];
let found = false;

function scan(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'llms.txt' || entry.startsWith('.next')) continue;
    const fp = path.join(dir, entry);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) scan(fp);
    else {
      const text = fs.readFileSync(fp, 'utf8');
      const lines = text.split('\n');
      if (lines.some(line => BAD.some(b => line.startsWith(b)))) {
        console.error(`Merge markers found in ${fp}`);
        found = true;
      }
    }
  }
}
scan(ROOT);
if (found) {
  console.error('❌ Merge conflict markers detected. Resolve before building/committing.');
  process.exit(1);
}
