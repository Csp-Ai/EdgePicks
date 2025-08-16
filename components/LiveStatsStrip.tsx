"use client";

import { useEffect, useState } from "react";
import { getKpis } from "@/lib/ui/kpis";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
}

function Stat({ value, label, suffix = "" }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 1200;
    const stepTime = 40;
    const increment = value / (duration / stepTime);
    const id = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(id);
      }
      setCount(Math.round(current));
    }, stepTime);
    return () => clearInterval(id);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold">
        {count}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function LiveStatsStrip() {
  const [kpis] = useState(getKpis);
  return (
    <section className="flex flex-wrap justify-center gap-8 rounded-xl border bg-background/40 p-4">
      <Stat value={kpis.usersHelped} label="Users helped" />
      <Stat value={kpis.avgAccuracy} label="Avg accuracy" suffix="%" />
      <Stat value={kpis.co2Saved} label="CO₂ saved" suffix="kg" />
    </section>
  );
}
