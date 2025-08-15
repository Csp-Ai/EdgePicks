import { execSync } from 'node:child_process';

const { NPM_CONFIG_PROXY, NPM_CONFIG_HTTPS_PROXY } = process.env;
const isUrl = v => typeof v === 'string' && /^https?:\/\//i.test(v);

try {
  if (isUrl(NPM_CONFIG_PROXY) && isUrl(NPM_CONFIG_HTTPS_PROXY)) {
    execSync(`npm config set proxy "${NPM_CONFIG_PROXY}"`, { stdio: 'inherit' });
    execSync(`npm config set https-proxy "${NPM_CONFIG_HTTPS_PROXY}"`, { stdio: 'inherit' });
    console.log('npm proxy set');
  } else {
    execSync('npm config delete proxy || true', { stdio: 'inherit' });
    execSync('npm config delete https-proxy || true', { stdio: 'inherit' });
    console.log('npm proxy cleared');
  }
} catch {
  // ignore errors
}
process.exit(0);
