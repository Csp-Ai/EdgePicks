"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { NodeObject, LinkObject } from "force-graph";
import LoadingShimmer from "./LoadingShimmer";
import { demoGraph } from "@/lib/agents/demoGraph";

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((m) => m.ForceGraph2D),
  { ssr: false },
) as unknown as typeof import("react-force-graph").ForceGraph2D;

type Role = "scout" | "analyst" | "model" | "arbiter";

export interface AgentNode extends NodeObject {
  id: string;            // stable id
  label: string;         // display name
  role: Role;            // node color key
  confidence: number;    // 0..1 (used for size/legend)
}

export interface AgentLink extends LinkObject<AgentNode> {
  source: string | AgentNode;
  target: string | AgentNode;
  confidence: number;    // 0..1 (used for width)
}

interface DetailedAgentNode extends AgentNode {
  summary: string;
  logs: string[];
  lastEvent: string;
}

interface DetailedAgentLink extends AgentLink {
  type: "data" | "modeling" | "arbitration" | "explain";
  lastEvent: string;
}

type AgentGraph = { nodes: DetailedAgentNode[]; links: DetailedAgentLink[] };

const roleColors: Record<Role, string> = {
  scout: "#3b82f6",
  analyst: "#f97316",
  model: "#a855f7",
  arbiter: "#84cc16",
};

const roleToColor = (role: Role): string => roleColors[role];

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Data", value: "data" },
  { label: "Modeling", value: "modeling" },
  { label: "Arbitration", value: "arbitration" },
  { label: "Explain", value: "explain" },
];

export default function AgentFlowVisualizer() {
  const [graph, setGraph] = useState<AgentGraph | null>(null);
  const [selected, setSelected] = useState<DetailedAgentNode | null>(null);
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
        if (active) setGraph(demoGraph as AgentGraph);
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

  const filtered =
    filter === "all" ? graph.links : graph.links.filter((l) => l.type === filter);
  const nodes: AgentNode[] = graph.nodes;
  const links: AgentLink[] = filtered;

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
      <ForceGraph2D<AgentNode, AgentLink>
        graphData={{ nodes, links }}
        nodeCanvasObject={(node: AgentNode, ctx: CanvasRenderingContext2D, scale: number) => {
          const radius = Math.max(4, 8 * (node.confidence ?? 0.5));
          ctx.fillStyle = roleToColor(node.role);
          ctx.beginPath();
          ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI, false);
          ctx.fill();
          const label = node.label;
          ctx.font = `${12 / scale}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#000";
          ctx.fillText(label, node.x ?? 0, (node.y ?? 0) - radius - 4);
        }}
        nodePointerAreaPaint={(node: AgentNode, color: string, ctx: CanvasRenderingContext2D) => {
          const radius = Math.max(4, 8 * (node.confidence ?? 0.5));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkWidth={(link: AgentLink) => Math.max(1, 4 * (link.confidence ?? 0.5))}
        linkColor={(link: AgentLink) => roleToColor((link.source as AgentNode).role)}
        onNodeClick={(node: AgentNode) => setSelected(node as DetailedAgentNode)}
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
