export const getUpcomingGames = async (league: string = 'NFL') => {
  const res = await fetch(`/api/upcoming-games?league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming games');
  const data = await res.json();
  if (Array.isArray(data) && data.some((g) => g.useFallback || g.source === 'fallback')) {
    throw new Error('Upcoming games data unavailable');
  }
  return data;
};

export const runPredictions = async (league: string, games: any[]) => {
  const correlationId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto as any).randomUUID()
      : undefined;
  await (await import('./logUiEvent')).logUiEvent(
    'runPredictions',
    { league, games: games.length },
    correlationId,
  );
  const res = await fetch('/api/run-predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-correlation-id': correlationId || '',
    },
    body: JSON.stringify({ league, games }),
  });
  if (!res.ok) throw new Error('Prediction flow failed');
  return res.json();
};
