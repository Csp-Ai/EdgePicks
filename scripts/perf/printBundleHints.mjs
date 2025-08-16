import fs from 'node:fs';
const report = '.next/analyze/client.html';
if (fs.existsSync(report)) {
  console.log('Bundle analysis at', report);
  console.log('Hint: Look for recharts, force-graph, and any UI lib duplication across pages.');
} else {
  console.log('Run: npm run analyze');
}
