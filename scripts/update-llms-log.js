#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
}

function getTaskName(message, branch) {
  const firstLine = message.split('\n')[0].trim();
  if (firstLine.startsWith('codex:')) {
    return firstLine.slice('codex:'.length).trim();
  }
  if (branch.startsWith('codex/')) {
    return branch.slice('codex/'.length).trim();
  }
  return null;
}

function main() {
  const commitMsg = run('git log -1 --pretty=%B');
  if (/\[skip-llms\]/.test(commitMsg)) return;

  const hash = run('git rev-parse HEAD');
  const author = run('git log -1 --pretty=%an');
  const timestamp = new Date().toISOString();
  const branch = run('git rev-parse --abbrev-ref HEAD');
  const task = getTaskName(commitMsg, branch);

  const numstat = run('git show --numstat --format="" HEAD');
  const files = numstat
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [added, removed, file] = line.split('\t');
      return `- ${file} (+${added}/-${removed})`;
    })
    .join('\n');

  let entry = `Timestamp: ${timestamp}\nCommit: ${hash}\nAuthor: ${author}\nMessage: ${commitMsg.split('\n')[0]}\n`;
  if (task) entry += `Task: ${task}\n`;
  entry += `Files:\n${files}\n\n`;

  const logPath = path.join(process.cwd(), 'llms.txt');
  fs.appendFileSync(logPath, entry);

  run('git add llms.txt');
  run('git commit --no-verify -m "chore: update llms log [skip-llms]"');
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { run, getTaskName, main };
