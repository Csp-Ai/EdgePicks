"use client";
import React from 'react';
import MatchupInsights from '@/components/predictions/MatchupInsights';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
const PredictionsPage: React.FC = () => {
  return <MatchupInsights />;
};

export default PredictionsPage;
