import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { freezeTime } from './utils/freezeTime';

describe('llms log', () => {
  let unfreeze: () => void;
  let restoreRand: () => void;

  beforeAll(() => {
    unfreeze = freezeTime('2024-01-01T00:00:00.000Z');
    const rand = jest.spyOn(Math, 'random').mockReturnValue(0.123456);
    restoreRand = () => rand.mockRestore();
  });

  afterAll(() => {
    unfreeze();
    restoreRand();
  });

  it('writes entry (stable time)', () => {
    const file = path.join(__dirname, '..', 'llms.txt');
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    expect(hash).toMatchSnapshot();
  });
});
