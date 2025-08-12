"use client";

import * as React from "react";

type Props = {
  // keep fields optional to avoid strict errors
  teamA?: string;
  teamB?: string;
  data?: any;
};

export default function MatchupInsights({ teamA, teamB, data }: Props) {
  // nullish coalescing to avoid strictness issues
  const a = teamA ?? "";
  const b = teamB ?? "";
  const d = data ?? null;

  // ...existing UI using a,b,d
  return <div data-testid="matchup-insights" />;
}
