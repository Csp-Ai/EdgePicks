import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type PromptEntry = {
  source: 'llms' | 'pr';
  timestamp?: string;
  header: string;
  summary: string;
  commit?: string;
};

function parseLlms(filePath: string): PromptEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const entries: PromptEntry[] = [];

  let current: Partial<PromptEntry> | null = null;
  let summaryLines: string[] = [];
  let inSummary = false;

  for (const line of lines) {
    if (line.startsWith('Timestamp:')) {
      if (current) {
        current.summary = summaryLines.join(' ');
        entries.push({ ...(current as PromptEntry), source: 'llms' });
      }
      current = { timestamp: line.replace('Timestamp:', '').trim() };
      summaryLines = [];
      inSummary = false;
    } else if (line.startsWith('codex:')) {
      if (current) {
        current.header = line.trim();
      }
    } else if (line === 'Summary:') {
      inSummary = true;
    } else if (inSummary && line.startsWith('-')) {
      summaryLines.push(line.replace(/^-\s*/, '').trim());
    } else if (inSummary && (line.trim() === '' || /^[A-Za-z]+:/.test(line))) {
      inSummary = false;
    }
  }

  if (current) {
    current.summary = summaryLines.join(' ');
    entries.push({ ...(current as PromptEntry), source: 'llms' });
  }

  return entries.map((e) => ({ ...e, header: e.header || e.summary.slice(0, 60) }));
}

function parsePRHistory(): PromptEntry[] {
  let output = '';
  try {
    output = execSync("git log --grep='Prompt' --grep='codex:' --no-merges --pretty=format:'%H|%cI|%s<<SEP>>'", {
      encoding: 'utf-8',
    });
  } catch {
    return [];
  }
  const entries: PromptEntry[] = [];
  const parts = output.split('<<SEP>>');
  for (const part of parts) {
    const line = part.trim();
    if (!line) continue;
    const [hash, date, subject] = line.split('|');
    entries.push({
      source: 'pr',
      commit: hash,
      timestamp: date,
      header: subject.trim(),
      summary: subject.trim(),
    });
  }
  return entries;
}

function main() {
  const llmsPath = path.join(__dirname, '..', 'llms.txt');
  const entries = [...parseLlms(llmsPath), ...parsePRHistory()];
  const outPath = path.join(__dirname, '..', 'data', 'prompt-registry.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2));
  console.log(`Wrote ${entries.length} prompt entries to ${outPath}`);
}

main();
