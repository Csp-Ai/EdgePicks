export const getUpcomingGames = async (league: string = 'NFL') => {
  const res = await fetch(`/api/upcoming-games?league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming games');
  if (res.headers.get('x-missing-api-key')) {
    console.warn('No SPORTS_DB_API_KEY is set. Using mock data for games.');
  }
  const data = await res.json();
  if (Array.isArray(data) && data.some((g) => g.useFallback || g.source === 'fallback')) {
    console.warn('Mock data is being used for predictions.');
  }
  return data;
};

export const runPredictions = async (league: string, games: any[]) => {
  const res = await fetch('/api/run-predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ league, games }),
  });
  if (!res.ok) throw new Error('Prediction flow failed');
  return res.json();
};
