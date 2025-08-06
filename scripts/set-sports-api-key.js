#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const apiKey = 'dac119a231fa4062abcadc7222e69889';
const keyLine = `NEXT_PUBLIC_SPORTS_API_KEY=${apiKey}`;

(async () => {
  try {
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');

      if (content.includes('NEXT_PUBLIC_SPORTS_API_KEY=')) {
        // Replace existing line
        content = content.replace(/NEXT_PUBLIC_SPORTS_API_KEY=.*/g, keyLine);
      } else {
        // Append if not present
        content += `\n${keyLine}`;
      }
    } else {
      content = keyLine;
    }

    fs.writeFileSync(envPath, content.trim() + '\n');
    console.log('.env.local updated with SportsDataIO API key ✅');
  } catch (err) {
    console.error('❌ Failed to write .env.local:', err);
    process.exit(1);
  }
})();
