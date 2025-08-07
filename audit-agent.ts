import fs from 'fs';
import path from 'path';

interface Issue {
  file: string;
  line: number;
  message: string;
}

const root = process.cwd();
const issues: Issue[] = [];

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.git') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function checkFile(file: string) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const ext = path.extname(file);

  if (ext === '.ts' || ext === '.tsx') {
    lines.forEach((line, idx) => {
      if (/\bany\b/.test(line)) {
        issues.push({ file, line: idx + 1, message: 'uses any type' });
      }
      if (/console\.log/.test(line)) {
        issues.push({ file, line: idx + 1, message: 'contains console.log' });
      }
      if (/TODO/i.test(line)) {
        issues.push({ file, line: idx + 1, message: 'TODO found' });
      }
    });
  }

  if (path.basename(file).startsWith('.env')) {
    lines.forEach((line, idx) => {
      if (!line || line.trim().startsWith('#')) return;
      const [key, value] = line.split('=');
      if (value && value.trim() && !/^<.*>$/.test(value.trim())) {
        issues.push({ file, line: idx + 1, message: `env value for ${key} may be committed` });
      }
    });
  }
}

walk(root).forEach(checkFile);

const score = Math.max(0, 1 - issues.length * 0.01);

const result = {
  agent: 'auditAgent',
  score,
  reasoning: issues.length ? `Found ${issues.length} potential issues` : 'No issues found',
  metadata: { issues },
};

console.log(JSON.stringify(result, null, 2));
