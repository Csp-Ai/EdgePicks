import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';
export const revalidate = 300; // Revalidate every 5 minutes

interface GamePrediction {
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

async function getLiveGames(): Promise<GamePrediction[]> {
  // Get live games from Supabase
  const { data: games, error } = await supabase
    .from('live_games')
    .select('*')
    .eq('status', 'upcoming')
    .order('time', { ascending: true });

  if (error) {
    console.error('Failed to fetch live games:', error);
    throw new Error('Failed to fetch live games');
  }

  return games;
}

async function getMockGames(): Promise<GamePrediction[]> {
  // Return mock data for development
  return [
    {
      homeTeam: 'Eagles',
      awayTeam: 'Cowboys',
      league: 'NFL',
      time: new Date(Date.now() + 86400000).toISOString(),
      confidence: 0.85,
      edgePick: [],
      winner: 'Eagles',
      edgeDelta: 0.15,
      odds: {
        spread: -3.5,
        overUnder: 48.5,
        moneyline: { home: -180, away: 160 },
        bookmaker: 'FanDuel',
        lastUpdate: new Date().toISOString()
      }
    },
    // Add more mock games here
  ];
}

export async function GET() {
  try {
    let games: GamePrediction[];
    
    if (ENV.LIVE_MODE === 'on') {
      games = await getLiveGames();
    } else {
      games = await getMockGames();
    }

    // Only return games that are upcoming (within next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    games = games.filter(game => {
      const gameTime = new Date(game.time);
      return gameTime <= sevenDaysFromNow;
    });

    // Sort games by time
    games.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming games' },
      { status: 500 }
    );
  }
}
