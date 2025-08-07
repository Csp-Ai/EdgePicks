import React from 'react';
import { AgentExecution } from '../lib/flow/runFlow';
import { formatAgentName } from '../lib/utils';

interface Props {
  logs: AgentExecution[][];
}

/**
 * Display agent execution logs for each matchup.
 * Logs are grouped by matchup and list each agent's
 * selected team, score, and reasoning.
 */
const LiveGameLogsPanel: React.FC<Props> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {logs.map((matchLogs, idx) => (
        <div key={idx} className="border rounded p-4">
          <h3 className="font-semibold mb-2">Matchup {idx + 1}</h3>
          {matchLogs && matchLogs.length > 0 ? (
            <ul className="space-y-1">
              {matchLogs.map((log) => (
                <li key={log.name} className="text-sm">
                  <span className="font-medium">{formatAgentName(log.name)}: </span>
                  {log.result ? (
                    <span>
                      {log.result.team} ({Math.round((log.result.score || 0) * 100)}%) -{' '}
                      {log.result.reason}
                    </span>
                  ) : (
                    <span className="text-red-600">Error</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No agent logs.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default LiveGameLogsPanel;
