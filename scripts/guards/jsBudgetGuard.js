const summary = process.env.BUILD_SUMMARY || '';
const match = (re) => {
  const m = re.exec(summary);
  return m ? parseFloat(m[1]) : NaN;
};

const appKb = match(/Route \(app\)[\s\S]*?First Load JS shared by all\s+([\d.]+)\s*kB/i);
const pagesKb = match(/Route \(pages\)[\s\S]*?First Load JS shared by all\s+([\d.]+)\s*kB/i);
const LIMIT_APP = 390;
const LIMIT_PAGES = 430;

const report = [];
let fail = false;

const check = (label, kb, limit) => {
  if (Number.isNaN(kb)) {
    report.push(`❌ Could not find "${label}" First Load JS in build output.`);
    fail = true;
  } else if (kb > limit) {
    report.push(`❌ ${label} First Load JS = ${kb} kB (limit ${limit} kB).`);
    fail = true;
  } else {
    report.push(`✅ ${label} JS budget ok: ${kb} kB (limit ${limit} kB).`);
  }
};
check('app', appKb, LIMIT_APP);
check('pages', pagesKb, LIMIT_PAGES);

console.log(report.join('\n'));
if (fail) process.exit(1);
