export const getUpcomingGames = async (league: string = 'NFL') => {
  const res = await fetch(`/api/upcoming-games?league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming games');
  return res.json();
};

export const runPredictionFlow = async () => {
  const res = await fetch('/api/run-agents', { method: 'POST' });
  if (!res.ok) throw new Error('Prediction flow failed');
  return res.json();
};
