import { ENV } from './env';

export interface Game {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  confidence: number;
  edgePick: any[];
  winner: string;
  edgeDelta: number;
  odds?: {
    spread?: number;
    overUnder?: number;
    moneyline?: { home?: number; away?: number };
    bookmaker?: string;
    lastUpdate?: string;
  };
}

export async function fetchUpcomingGames(league?: string): Promise<Game[]> {
  try {
    const response = await fetch(
      `${ENV.NEXT_PUBLIC_SITE_URL}/api/upcoming-games${league ? `?league=${league}` : ''}`,
      {
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming games');
    }

    const games = await response.json();
    
    if (league) {
      return games.filter((game: Game) => game.league === league);
    }

    return games;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
}

export async function fetchGamePrediction(homeTeam: string, awayTeam: string): Promise<Game | null> {
  try {
    const response = await fetch(
      `${ENV.NEXT_PUBLIC_SITE_URL}/api/run-predictions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          homeTeam,
          awayTeam
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch game prediction');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching game prediction:', error);
    return null;
  }
}
