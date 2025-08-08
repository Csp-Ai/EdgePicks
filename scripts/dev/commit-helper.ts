import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';

const statePath = path.join(os.homedir(), '.edgepicks-focus.json');
let focusTitle = '';
try {
  const raw = fs.readFileSync(statePath, 'utf-8');
  const data = JSON.parse(raw);
  focusTitle = data.focusTitle || '';
} catch {
  // ignore missing
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question(`Commit message (${focusTitle}): `, (answer) => {
  const msg = answer || focusTitle;
  const body = `- [ ] ${focusTitle}\n`;
  try {
    fs.writeFileSync(path.join(process.cwd(), '.git', 'EDGEPR_TEMPLATE_BODY.md'), body);
  } catch {
    // ignore
  }
  console.log(msg);
  rl.close();
});
