import React from 'react';

type Props = {
  onClose: () => void;
};

const ExplanationGlossary: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Agent Glossary</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <strong>injuryScout</strong>: evaluates player injury reports and roster depth to assess how absences could sway the matchup.
          </li>
          <li>
            <strong>lineWatcher</strong>: monitors betting line movement to reflect the market's confidence in each team.
          </li>
          <li>
            <strong>statCruncher</strong>: favors efficiency metrics, defensive strength, and other advanced stats to compare teams.
          </li>
          <li>
            <strong>trendsAgent</strong>: surfaces historical and momentum trends that may influence outcomes.
          </li>
          <li>
            <strong>guardianAgent</strong>: highlights warnings when agent outputs conflict or signal risk.
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExplanationGlossary;

