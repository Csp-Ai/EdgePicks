const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const script = path.join(__dirname, 'update-llms-log.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-log-test-'));

function run(cmd) {
  return execSync(cmd, { cwd: tmp, stdio: 'pipe' }).toString().trim();
}

// initialize repo
run('git init');
fs.writeFileSync(path.join(tmp, 'llms.txt'), '');
fs.writeFileSync(path.join(tmp, 'a.txt'), 'hello');
run('git add .');
run('git commit -m "feat: initial"');

// run script and verify log
run(`node ${script}`);
const log1 = fs.readFileSync(path.join(tmp, 'llms.txt'), 'utf8');
assert(log1.includes('feat: initial'), 'log should include commit message');
assert(/Commit: [0-9a-f]{7,}/.test(log1), 'log should include commit hash');
assert(log1.includes('a.txt'), 'log should list changed file');
const count1 = run('git rev-list --count HEAD');
assert.strictEqual(count1, '2');
const lastMsg1 = run('git log -1 --pretty=%s');
assert(lastMsg1.includes('[skip-llms]'), 'log commit should contain skip flag');

// create commit that should be skipped
fs.writeFileSync(path.join(tmp, 'b.txt'), 'more');
run('git add b.txt');
run('git commit -m "chore: ignore [skip-llms]"');
run(`node ${script}`);
const count2 = run('git rev-list --count HEAD');
assert.strictEqual(count2, '3', 'no extra commit for skipped log');
const log2 = fs.readFileSync(path.join(tmp, 'llms.txt'), 'utf8');
assert(!log2.includes('chore: ignore'), 'skipped commit should not be logged');

console.log('All update-llms-log tests passed');
