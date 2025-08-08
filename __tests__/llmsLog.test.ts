import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { freezeTime } from './utils/freezeTime';

describe('llms log', () => {
  it('writes entry (stable time)', () => {
    const unfreeze = freezeTime('2025-02-02T02:02:02.000Z');
    const file = path.join(__dirname, '..', 'llms.txt');
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    unfreeze();
    expect(hash).toMatchSnapshot();
  });
});
