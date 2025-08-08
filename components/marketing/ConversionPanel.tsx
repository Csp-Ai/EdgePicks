import React from 'react';

interface Props {
  onKeepSettings?: () => void;
}

const valueProps = [
  'Save your demo matchups and preferences',
  'Track picks across devices',
  'Sign up later with one click',
];

const ConversionPanel: React.FC<Props> = ({ onKeepSettings }) => {
  return (
    <div
      className="bg-white border rounded-lg p-6 space-y-4"
      data-testid="conversion-panel"
    >
      <h2 className="text-xl font-semibold">Ready to keep your settings?</h2>
      <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
        {valueProps.map((prop) => (
          <li key={prop}>{prop}</li>
        ))}
      </ul>
      <button
        onClick={onKeepSettings}
        className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Keep my demo settings
      </button>
    </div>
  );
};

export default ConversionPanel;
