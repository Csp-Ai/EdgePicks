// scripts/hasDiagramChanged.ts
import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DIAGRAM_PATH = path.resolve('docs/system-diagram.png');
const HASH_PATH = path.resolve('.diagram-hash');

function computeHash(filePath: string): string {
  const buffer = readFileSync(filePath);
  return createHash('sha256').update(buffer).digest('hex');
}

// ✅ Exported for use in CI scripts or tests
export function hasDiagramChanged(): boolean {
  if (!existsSync(DIAGRAM_PATH)) {
    console.error('❌ Diagram not found at:', DIAGRAM_PATH);
    return true; // Treat missing file as "changed"
  }

  const newHash = computeHash(DIAGRAM_PATH);

  if (!existsSync(HASH_PATH)) {
    writeFileSync(HASH_PATH, newHash);
    return false; // No prior hash = initial commit, no change
  }

  const oldHash = readFileSync(HASH_PATH, 'utf-8').trim();

  if (newHash === oldHash) {
    return false;
  }

  writeFileSync(HASH_PATH, newHash);
  return true;
}

// ✅ CLI support for local testing
if (require.main === module) {
  const changed = hasDiagramChanged();
  if (changed) {
    console.log('🆕 Diagram changed.');
    process.exit(1);
  } else {
    console.log('✅ Diagram unchanged. No action needed.');
    process.exit(0);
  }
}

