import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const schemaPath = path.join(__dirname, '..', 'schemas', 'agent-result.schema.json');
const validPath = path.join(__dirname, '..', 'schemas', 'fixtures', 'valid-agent-result.json');
const invalidPath = path.join(__dirname, '..', 'schemas', 'fixtures', 'invalid-agent-result.json');

describe('agent-result schema', () => {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const validFixture = JSON.parse(fs.readFileSync(validPath, 'utf-8'));
  const invalidFixture = JSON.parse(fs.readFileSync(invalidPath, 'utf-8'));

  it('accepts a valid agent result', () => {
    expect(validate(validFixture)).toBe(true);
  });

  it('rejects an invalid agent result', () => {
    expect(validate(invalidFixture)).toBe(false);
  });
});
