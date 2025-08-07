// scripts/hasDiagramChanged.ts
import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const diagramPath = path.resolve('docs/system-diagram.png');
const hashCachePath = path.resolve('.diagram-hash');

function getHash(filePath: string): string {
  const buffer = readFileSync(filePath);
  return createHash('sha256').update(buffer).digest('hex');
}

function main() {
  if (!existsSync(diagramPath)) {
    console.error('Diagram file not found:', diagramPath);
    process.exit(1);
  }

  const newHash = getHash(diagramPath);
  let oldHash = '';

  if (existsSync(hashCachePath)) {
    oldHash = readFileSync(hashCachePath, 'utf-8').trim();
  }

  if (newHash === oldHash) {
    console.log('✅ Diagram unchanged. No action needed.');
    process.exit(0);
  } else {
    console.log('🆕 Diagram changed.');
    writeFileSync(hashCachePath, newHash);
    process.exit(1); // Indicate change for CI
  }
}

main();
