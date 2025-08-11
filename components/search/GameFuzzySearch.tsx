import React, { useMemo, useState } from 'react';
import type { Game } from '@/lib/types';
import { createFuzzySearch } from '@/lib/search/fuzzy';

interface Props {
  games: Game[];
  onSelect: (game: Game) => void;
  placeholder?: string;
}

const GameFuzzySearch: React.FC<Props> = ({
  games,
  onSelect,
  placeholder = 'Search games...',
}) => {
  const [query, setQuery] = useState('');
  const search = useMemo(
    () => createFuzzySearch(games, { keys: ['homeTeam', 'awayTeam'] }),
    [games]
  );
  const results = useMemo(() => search(query), [search, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded text-slate-900"
        data-testid="game-search-input"
      />
      {query && (
        <ul
          className="mt-2 border rounded bg-white text-slate-900 divide-y"
          data-testid="results-list"
        >
          {results.length === 0 && (
            <li className="px-2 py-1 text-slate-500" data-testid="no-results">
              No matches
            </li>
          )}
          {results.map((game) => (
            <li key={game.gameId}>
              <button
                type="button"
                onClick={() => onSelect(game)}
                className="block w-full text-left px-2 py-1 hover:bg-slate-100"
                data-testid="result-item"
              >
                {game.homeTeam} vs {game.awayTeam}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameFuzzySearch;
