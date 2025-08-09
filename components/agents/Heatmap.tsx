import React, { useRef } from 'react';
import { formatAgentName } from '../../lib/utils';

interface HeatmapData {
  agents: string[];
  signals: string[];
  values: number[][]; // values[agentIndex][signalIndex]
}

interface Props {
  data: HeatmapData;
}

const Heatmap: React.FC<Props> = ({ data }) => {
  const { agents, signals, values } = data;
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);

  const focusCell = (r: number, c: number) => {
    const cell = cellRefs.current[r]?.[c];
    cell?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableCellElement>,
    r: number,
    c: number
  ) => {
    let nextR = r;
    let nextC = c;
    switch (e.key) {
      case 'ArrowRight':
        nextC = Math.min(c + 1, signals.length - 1);
        break;
      case 'ArrowLeft':
        nextC = Math.max(c - 1, 0);
        break;
      case 'ArrowDown':
        nextR = Math.min(r + 1, agents.length - 1);
        break;
      case 'ArrowUp':
        nextR = Math.max(r - 1, 0);
        break;
      default:
        return;
    }
    e.preventDefault();
    focusCell(nextR, nextC);
  };

  return (
    <table
      className="border-collapse"
      role="grid"
      aria-label="Agent Signal Heatmap"
    >
      <thead>
        <tr>
          <th></th>
          {signals.map((signal) => (
            <th key={signal} scope="col" className="px-2 py-1 text-left">
              {signal}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {agents.map((agent, r) => (
          <tr key={agent}>
            <th scope="row" className="px-2 py-1 text-left">
              {formatAgentName(agent)}
            </th>
            {signals.map((signal, c) => (
              <td
                key={signal}
                ref={(el) => {
                  cellRefs.current[r] = cellRefs.current[r] || [];
                  if (el) cellRefs.current[r][c] = el;
                }}
                tabIndex={0}
                aria-label={`${formatAgentName(agent)} ${signal} ${values[r][c]}`}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                style={{
                  backgroundColor: `rgba(16, 185, 129, ${values[r][c]})`,
                }}
                className="w-8 h-8 text-center text-xs"
              >
                {values[r][c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Heatmap;

