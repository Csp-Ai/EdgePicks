"use client";

import React, { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph";
import LoadingShimmer from "./LoadingShimmer";
import { getDemoGraph, type AgentGraph, type AgentNode, type AgentLink } from "@/lib/agents/demoGraph";

const roleColors: Record<AgentNode["role"], string> = {
  scout: "#3b82f6",
  cruncher: "#f97316",
  arbiter: "#84cc16",
  explainer: "#a855f7",
};

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Data", value: "data" },
  { label: "Modeling", value: "modeling" },
  { label: "Arbitration", value: "arbitration" },
  { label: "Explain", value: "explain" },
];

export default function AgentFlowVisualizer() {
  const [graph, setGraph] = useState<AgentGraph | null>(null);
  const [selected, setSelected] = useState<AgentNode | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/agent-graph");
        if (!res.ok) throw new Error("bad");
        const data = (await res.json()) as AgentGraph;
        if (active) setGraph(data);
      } catch {
        if (active) setGraph(getDemoGraph());
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setWidth(window.innerWidth);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (typeof window === "undefined" || width !== null && width < 600) {
    return (
      <div className="h-64 w-full border rounded-md flex items-center justify-center">
        <LoadingShimmer lines={4} />
      </div>
    );
  }

  if (!graph) {
    return <LoadingShimmer lines={4} />;
  }

  const filtered = filter === "all" ? graph.links : graph.links.filter((l) => l.type === filter);
  const data = { nodes: graph.nodes, links: filtered };

  return (
    <div className="relative">
      <div className="mb-2 flex justify-end">
        <select
          aria-label="Filter links"
          className="border rounded-md p-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ForceGraph2D
        graphData={data}
        nodeColor={(node) => roleColors[(node as AgentNode).role]}
        nodeLabel={(node) => `${(node as AgentNode).id}: ${(node as AgentNode).lastEvent} (${Math.round((node as AgentNode).confidence * 100)}%)`}
        linkWidth={(link) => Math.max(1, (link as AgentLink).confidence * 3)}
        linkLabel={(link) => `${(link as AgentLink).lastEvent} (${Math.round((link as AgentLink).confidence * 100)}%)`}
        onNodeClick={(node) => setSelected(node as AgentNode)}
        width={width ?? 800}
        height={500}
      />
      {selected && (
        <div className="absolute top-0 right-0 h-full w-64 bg-white border-l shadow p-4 overflow-y-auto">
          <button
            className="mb-2 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
          <h2 className="font-semibold mb-1">{selected.id}</h2>
          <p className="text-sm mb-2">{selected.summary}</p>
          <div className="text-xs text-muted-foreground mb-2">
            Last event: {selected.lastEvent} ({Math.round(selected.confidence * 100)}%)
          </div>
          <ul className="text-sm list-disc pl-4 space-y-1">
            {selected.logs.slice(0, 3).map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
