import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { freezeTime } from './utils/freezeTime';

// Snapshot hash is sensitive to timestamps inside llms.txt. We freeze time so it
// remains stable. Update the snapshot if the frozen ISO changes.
describe('llms log', () => {
  let restore: () => void;

  beforeAll(() => {
    restore = freezeTime('2024-01-02T03:04:05.000Z');
  });

  afterAll(() => {
    restore();
  });

  it('writes entry (stable time)', () => {
    const file = path.join(__dirname, '..', 'llms.txt');
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    expect(hash).toMatchSnapshot();
  });
});
