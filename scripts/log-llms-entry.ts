import { execSync } from 'child_process';
import fs from 'fs';

const timestamp = new Date().toISOString();
const commitMsg = execSync('git log -1 --pretty=%B').toString().trim();
const filesChangedOutput = execSync('git diff --name-only HEAD~1 HEAD').toString().trim();
const filesChanged = filesChangedOutput ? filesChangedOutput.split('\n') : [];

const entry = `
Timestamp: ${timestamp}
codex:auto-generated-llms-log
Summary:

${commitMsg}
Files:
${filesChanged.map(f => `- ${f}`).join('\n')}
`;

fs.appendFileSync('llms.txt', entry);
console.log('✅ llms.txt updated.');
