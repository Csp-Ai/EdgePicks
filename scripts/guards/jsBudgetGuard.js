const summary = process.env.BUILD_SUMMARY || '';
const pickKb = (label) => {
  const re = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+([\\d.]+)\\s*kB', 'i');
  const m = re.exec(summary);
  return m ? parseFloat(m[1]) : NaN;
};

const appKb = pickKb('Route (app)[\\s\\S]*?First Load JS shared by all');
const pagesKb = pickKb('Route (pages)[\\s\\S]*?First Load JS shared by all');
const LIMIT_APP = 390;   // step down target
const LIMIT_PAGES = 430; // step down target

const checks = [
  ['app', appKb, LIMIT_APP],
  ['pages', pagesKb, LIMIT_PAGES],
];

let fail = false;
for (const [name, kb, limit] of checks) {
  if (isNaN(kb)) {
    console.log(`ℹ️ Could not parse "${name}" first-load size; skipping.`);
    continue;
  }
  if (kb > limit) {
    console.error(`❌ ${name} First Load JS = ${kb} kB (limit ${limit} kB).`);
    fail = true;
  } else {
    console.log(`✅ ${name} JS budget ok: ${kb} kB (limit ${limit} kB).`);
  }
}
if (fail) process.exit(1);
