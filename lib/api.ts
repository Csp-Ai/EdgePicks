export async function getUpcomingGames(league: string) {
  const res = await fetch(`/api/upcoming-games?league=${encodeURIComponent(league)}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming games');
  return res.json();
}

export async function runPredictionFlow() {
  const res = await fetch('/api/run-agents?teamA=Team%20A&teamB=Team%20B&matchDay=1');
  if (!res.ok) throw new Error('Failed to run prediction flow');
  return res.json();
}

export async function getAgentScores() {
  const res = await fetch('/api/accuracy');
  if (!res.ok) throw new Error('Failed to fetch agent scores');
  return res.json();
}
