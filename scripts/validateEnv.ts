import { ENV } from '../lib/env';

void ENV; // Access to trigger validation via zod

console.log('✅ All env files contain required keys.');
