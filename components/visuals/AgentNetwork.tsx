"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

type Node = { id: string; x: number; y: number; label: string };
type Edge = { from: string; to: string };

// Lightweight, responsive SVG network with pulsing agent nodes.
export default function AgentNetwork() {
  const nodes: Node[] = useMemo(
    () => [
      { id: "injury", x: 18, y: 28, label: "InjuryScout" },
      { id: "weather", x: 78, y: 24, label: "WeatherEye" },
      { id: "odds", x: 22, y: 74, label: "LineWatcher" },
      { id: "stats", x: 64, y: 70, label: "StatCruncher" },
      { id: "final", x: 48, y: 48, label: "Consensus" },
    ],
    []
  );
  const edges: Edge[] = useMemo(
    () => [
      { from: "injury", to: "final" },
      { from: "weather", to: "final" },
      { from: "odds", to: "final" },
      { from: "stats", to: "final" },
    ],
    []
  );

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Edges */}
        {edges.map((e, i) => {
          const a = nodes.find(n => n.id === e.from)!;
          const b = nodes.find(n => n.id === e.to)!;
          return (
            <motion.line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: i * 0.15 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={n.id}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="3.6"
              className="text-primary"
              fill="currentColor"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.1, delay: i * 0.2 }}
            />
            <text
              x={n.x}
              y={n.y + 7}
              fontSize="3"
              textAnchor="middle"
              className="fill-muted-foreground"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
