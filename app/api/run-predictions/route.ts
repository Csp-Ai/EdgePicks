import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Demo predictions
  const predictions = {
    'game1': {
      winner: 'Lakers',
      confidence: 0.75,
      edges: [
        { from: 'InjuryScout', to: 'Guardian', confidence: 0.8 },
        { from: 'LineWatcher', to: 'Guardian', confidence: 0.7 },
        { from: 'StatCruncher', to: 'Guardian', confidence: 0.75 }
      ]
    },
    'game2': {
      winner: 'Bucks',
      confidence: 0.65,
      edges: [
        { from: 'InjuryScout', to: 'Guardian', confidence: 0.6 },
        { from: 'LineWatcher', to: 'Guardian', confidence: 0.7 },
        { from: 'StatCruncher', to: 'Guardian', confidence: 0.65 }
      ]
    }
  };

  return NextResponse.json(predictions);
}
