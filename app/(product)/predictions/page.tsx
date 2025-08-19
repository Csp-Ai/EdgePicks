import React from 'react';
import MatchupInsights from '@/components/predictions/MatchupInsights';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export default function PredictionsPage() {
  return <MatchupInsights />;
}
