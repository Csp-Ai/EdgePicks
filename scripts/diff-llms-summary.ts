import { execSync } from 'child_process';
import fs from 'fs';

function getFileAtRev(rev: string, file: string): string {
  try {
    return execSync(`git show ${rev}:${file}`, { encoding: 'utf8' });
  } catch {
    return '';
  }
}

type Entry = {
  timestamp: string;
  summary: string;
  commit?: string;
};

function parseEntries(content: string): Entry[] {
  const blocks = content.split(/\n(?=Timestamp:)/g).filter(Boolean);
  const entries: Entry[] = [];
  for (const block of blocks) {
    const timestampMatch = block.match(/Timestamp:\s*(.+)/);
    const commitMatch = block.match(/Commit:\s*([0-9a-f]{7,40})/);
    let summary = '';
    const summaryIdx = block.indexOf('Summary:');
    if (summaryIdx !== -1) {
      const after = block.slice(summaryIdx + 'Summary:'.length);
      const lines = after.split('\n');
      for (const line of lines) {
        if (/^(Testing:|Files:|Notes:|Timestamp:|codex:)/.test(line)) break;
        summary += line.trim() + '\n';
      }
      summary = summary.trim();
    }
    entries.push({
      timestamp: timestampMatch ? timestampMatch[1].trim() : '',
      summary,
      commit: commitMatch ? commitMatch[1] : undefined,
    });
  }
  return entries;
}

const prevContent = getFileAtRev('HEAD~1', 'llms.txt');
const currContent = getFileAtRev('HEAD', 'llms.txt');

const prevEntries = parseEntries(prevContent);
const currEntries = parseEntries(currContent);

const prevSummaries = new Map<string, Entry>();
for (const e of prevEntries) {
  if (e.summary) prevSummaries.set(e.summary, e);
}
const prevTimestamps = new Set(prevEntries.map(e => e.timestamp));

const audits: Array<Record<string, string>> = [];

for (const entry of currEntries) {
  if (prevTimestamps.has(entry.timestamp)) continue;

  if (entry.summary && prevSummaries.has(entry.summary)) {
    const prev = prevSummaries.get(entry.summary)!;
    if (prev.commit !== entry.commit) {
      audits.push({
        timestamp: entry.timestamp,
        issue: 'reused-summary',
        detail: entry.summary,
      });
    }
  }
  if (entry.commit) {
    try {
      execSync(`git cat-file -e ${entry.commit}`, { stdio: 'ignore' });
    } catch {
      audits.push({
        timestamp: entry.timestamp,
        issue: 'unknown-commit',
        detail: entry.commit,
      });
    }
  } else {
    audits.push({
      timestamp: entry.timestamp,
      issue: 'missing-commit',
    });
  }
}

fs.writeFileSync('llms-audit.json', JSON.stringify(audits, null, 2));

if (audits.length) {
  console.error('LLMS summary audit found issues');
  process.exitCode = 1;
} else {
  console.log('LLMS summaries OK');
}
