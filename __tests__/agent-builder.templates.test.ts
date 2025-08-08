import { templates } from '../lib/agent-builder/templates';
import { agentSpecSchema } from '../lib/agent-builder/schema';

describe('agent builder templates', () => {
  it('includes expected presets', () => {
    const ids = templates.map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining(['parlayFinder', 'injuryAware']));
  });

  it('provides valid agent specs', () => {
    for (const tpl of templates) {
      expect(agentSpecSchema.parse(tpl.spec)).toEqual(tpl.spec);
    }
  });
});
