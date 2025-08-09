import React, { useState } from 'react';
import { agentSpecSchema, AgentSpec } from '../../lib/agent-builder/schema';

export const generateSpec = (description: string): AgentSpec => {
  const words = description.trim().split(/\s+/);
  const name =
    words
      .slice(0, 2)
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      )
      .join('') || 'agent';

  const inputs: string[] = [];
  if (/injur/i.test(description)) inputs.push('injuryData');
  if (/line/i.test(description)) inputs.push('lineMovement');
  if (/stat/i.test(description)) inputs.push('stats');
  if (inputs.length === 0) inputs.push('general');

  const weight = Number((1 / inputs.length).toFixed(2));
  const weights = inputs.reduce<Record<string, number>>((acc, input) => {
    acc[input] = weight;
    return acc;
  }, {});

  return { name, inputs, weights };
};

const Wizard: React.FC = () => {
  const [useCase, setUseCase] = useState('');
  const [spec, setSpec] = useState<AgentSpec | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const draft = generateSpec(useCase);
    const result = agentSpecSchema.safeParse(draft);
    if (result.success) {
      setSpec(result.data);
      setError('');
    } else {
      setSpec(null);
      setError('Invalid spec');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        placeholder="Describe what this agent should do..."
        className="w-full rounded border p-2"
      />
      <button
        type="button"
        onClick={handleGenerate}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Generate
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {spec && (
        <pre className="rounded bg-gray-100 p-2 text-sm" aria-label="draft-spec">
          {JSON.stringify(spec, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Wizard;
