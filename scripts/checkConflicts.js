#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set(['.git', '.next', 'node_modules', 'public', '.vercel']);
const conflictRegex = /^<<<<<<<|^>>>>>>>/m;
const root = process.cwd();

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDir(path.join(dir, entry.name));
      }
    } else if (entry.isFile()) {
      const filePath = path.join(dir, entry.name);
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch {
        continue;
      }
      if (content.includes('\u0000')) continue;
      if (conflictRegex.test(content)) {
        console.error(`Conflict marker found in ${path.relative(root, filePath)}`);
        process.exit(1);
      }
    }
  }
}

scanDir(root);
process.exit(0);
