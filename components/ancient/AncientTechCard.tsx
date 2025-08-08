'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { agentCard } from '../../styles/cardStyles';

interface SimulationConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  outputLabel: string;
  formula: (value: number) => number;
}

interface AncientTechCardProps {
  title: string;
  principle: string;
  modernAnalog: string;
  simulation: SimulationConfig;
  applyLink: string;
}

const AncientTechCard: React.FC<AncientTechCardProps> = ({
  title,
  principle,
  modernAnalog,
  simulation,
  applyLink,
}) => {
  const [value, setValue] = useState(simulation.min);
  const result = simulation.formula(value);

  return (
    <div className={agentCard}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
        <span className="font-medium">Principle:</span> {principle}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        <span className="font-medium">Modern analog:</span> {modernAnalog}
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {simulation.label}: {value}
        </label>
        <input
          type="range"
          min={simulation.min}
          max={simulation.max}
          step={simulation.step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-2">
          {simulation.outputLabel}: {result.toFixed(1)} {simulation.unit}
        </div>
      </div>
      <Link
        href={applyLink}
        className="text-blue-600 hover:underline text-sm"
      >
        Apply in product thinking
      </Link>
    </div>
  );
};

export default AncientTechCard;
