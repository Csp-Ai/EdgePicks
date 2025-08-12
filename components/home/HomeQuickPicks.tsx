"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const QuickMatchups = dynamic(() => import("@/components/predictions/QuickMatchups"), { ssr: false });

const leagues = ["NFL", "MLB", "NBA"]; // lightweight toggle (future: filter upstream)

export default function HomeQuickPicks() {
  const [league, setLeague] = useState<string>("NFL");
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {leagues.map((l) => (
          <button
            key={l}
            onClick={() => setLeague(l)}
            className={`px-3 py-1 rounded-md border text-sm ${l === league ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            aria-pressed={l === league}
          >
            {l}
          </button>
        ))}
      </div>
      {/* For now QuickMatchups shows all; league filter can be wired when API supports it */}
      <QuickMatchups />
    </div>
  );
}

