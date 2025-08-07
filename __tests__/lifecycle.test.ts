import fs from 'fs';
import path from 'path';

describe('agent lifecycle logs', () => {
  it('matches snapshot', () => {
    const file = path.join(__dirname, '..', 'agentLogsStore.json');
    const logs = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(logs).toMatchSnapshot();
  });
});
