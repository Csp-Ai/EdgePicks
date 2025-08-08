import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

describe('llms log', () => {
  it('writes entry (stable time)', () => {
    const file = path.join(__dirname, '..', 'llms.txt');
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    expect(hash).toMatchSnapshot();
  });
});
