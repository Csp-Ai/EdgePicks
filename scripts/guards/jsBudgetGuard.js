// Parses Next build output from env var BUILD_SUMMARY (set in npm script)
const summary = process.env.BUILD_SUMMARY || '';
const m = /First Load JS shared by all\s+([\d.]+)\s*kB/i.exec(summary);
const kb = m ? parseFloat(m[1]) : NaN;
const LIMIT = 500; // adjust as needed

if (!isNaN(kb)) {
  if (kb > LIMIT) {
    console.error(`❌ First Load JS shared by all = ${kb} kB (limit ${LIMIT} kB).`);
    process.exit(1);
  } else {
    console.log(`✅ JS budget ok: ${kb} kB (limit ${LIMIT} kB).`);
  }
} else {
  console.log('ℹ️ Could not parse first-load size; skipping budget check.');
}
