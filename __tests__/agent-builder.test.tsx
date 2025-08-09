import { render, screen, fireEvent } from '@testing-library/react';
import Wizard, { generateSpec } from '../components/agent-builder/Wizard';
import { agentSpecSchema } from '../lib/agent-builder/schema';

describe('Agent Builder Wizard', () => {
  it('generates spec from description', () => {
    const spec = generateSpec('analyze injury and line data');
    expect(spec.name).toBe('analyzeInjury');
    expect(spec.inputs).toEqual(['injuryData', 'lineMovement']);
    expect(spec.weights).toEqual({ injuryData: 0.5, lineMovement: 0.5 });
    expect(agentSpecSchema.parse(spec)).toEqual(spec);
  });

  it('renders generated spec', () => {
    render(<Wizard />);
    const textarea = screen.getByPlaceholderText('Describe what this agent should do...');
    fireEvent.change(textarea, { target: { value: 'track stats' } });
    fireEvent.click(screen.getByText('Generate'));
    const output = screen.getByLabelText('draft-spec');
    const data = JSON.parse(output.textContent || '{}');
    expect(data).toMatchObject({ name: 'trackStats', inputs: ['stats'] });
  });
});
