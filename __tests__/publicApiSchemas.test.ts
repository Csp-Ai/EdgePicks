/** @jest-environment node */
import { zodToJsonSchema } from 'zod-to-json-schema';
import { accuracySchema } from '../lib/schemas/accuracy';
import { reflectionsSchema } from '../lib/schemas/reflections';
import { predictionsSchema } from '../lib/schemas/predictions';

describe('public API schema snapshots', () => {
  test('accuracy schema', () => {
    const schema = zodToJsonSchema(accuracySchema, 'Accuracy');
    expect(schema).toMatchSnapshot();
  });

  test('reflections schema', () => {
    const schema = zodToJsonSchema(reflectionsSchema, 'Reflections');
    expect(schema).toMatchSnapshot();
  });

  test('predictions schema', () => {
    const schema = zodToJsonSchema(predictionsSchema, 'Predictions');
    expect(schema).toMatchSnapshot();
  });
});
