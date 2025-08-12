import fs from 'fs';
import path from 'path';

if (
  process.env.VERCEL ||
  process.env.CI ||
  process.env.NODE_ENV === 'production'
) {
  console.log('Skipping .env.local bootstrap in CI/production.');
  process.exit(0);
}

const envLocal = path.resolve(process.cwd(), '.env.local');
const envExample = path.resolve(process.cwd(), '.env.local.example');

if (fs.existsSync(envLocal)) {
  console.log('.env.local already exists, skipping');
} else {
  const example = fs.readFileSync(envExample, 'utf8');
  fs.writeFileSync(envLocal, example);
  console.log('Created .env.local from .env.local.example');
}
