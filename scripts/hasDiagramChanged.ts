import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const DIAGRAM_PATH = 'docs/system-diagram.png';
const HASH_PATH = '.diagram-hash';

function computeHash(): string {
  const fileBuffer = readFileSync(DIAGRAM_PATH);
  return createHash('sha256').update(fileBuffer).digest('hex');
}

export function hasDiagramChanged(): boolean {
  const newHash = computeHash();
  if (!existsSync(HASH_PATH)) {
    writeFileSync(HASH_PATH, newHash);
    return false;
  }

  const oldHash = readFileSync(HASH_PATH, 'utf8').trim();
  if (newHash === oldHash) {
    return false;
  }

  writeFileSync(HASH_PATH, newHash);
  return true;
}

if (require.main === module) {
  const changed = hasDiagramChanged();
  process.exit(changed ? 1 : 0);
}
