import fs from 'fs';
import path from 'path';

const envLocal = path.resolve(process.cwd(), '.env.local');
const envExample = path.resolve(process.cwd(), '.env.local.example');

if (fs.existsSync(envLocal)) {
  console.log('.env.local already exists, skipping');
} else {
  const example = fs.readFileSync(envExample, 'utf8');
  fs.writeFileSync(envLocal, example);
  console.log('Created .env.local from .env.local.example');
}
