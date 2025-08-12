import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simulated data for demo
const upcomingGames = [
  {
    id: 'game1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    date: '2025-08-12T19:30:00Z',
    odds: {
      home: -110,
      away: -110
    }
  },
  {
    id: 'game2', 
    homeTeam: 'Celtics',
    awayTeam: 'Bucks',
    date: '2025-08-12T20:00:00Z',
    odds: {
      home: -115,
      away: -105
    }
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(upcomingGames);
}
