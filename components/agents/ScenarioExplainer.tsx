import React from 'react';

export interface ScenarioExplainerProps {
  injuries?: string[];
  weather?: string;
  lineMove?: {
    from: number;
    to: number;
  };
}

const ScenarioExplainer: React.FC<ScenarioExplainerProps> = ({
  injuries,
  weather,
  lineMove,
}) => {
  const items: string[] = [];

  if (injuries && injuries.length > 0) {
    items.push(`Key injuries: ${injuries.join(', ')}`);
  }

  if (weather) {
    items.push(`Weather forecast: ${weather}`);
  }

  if (lineMove) {
    const direction = lineMove.to > lineMove.from ? 'rose' : 'fell';
    items.push(`Line ${direction} from ${lineMove.from} to ${lineMove.to}`);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div data-testid="scenario-explainer">
      {items.map((text, idx) => (
        <p key={idx}>{text}</p>
      ))}
    </div>
  );
};

export default ScenarioExplainer;

