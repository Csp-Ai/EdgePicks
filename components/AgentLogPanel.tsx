"use client";

import type { AgentNode } from "@/components/AgentFlowVisualizer";

interface Props {
  node: (AgentNode & { summary?: string; logs?: string[] }) | null;
  onClose: () => void;
}

export default function AgentLogPanel({ node, onClose }: Props) {
  if (!node) return null;
  return (
    <aside className="absolute top-0 right-0 h-full w-64 overflow-y-auto border-l bg-background p-4 shadow">
      <button
        onClick={onClose}
        aria-label="Close agent log"
        className="mb-2 text-sm text-muted-foreground hover:text-foreground"
      >
        Close
      </button>
      <h2 className="mb-1 font-semibold">{node.label}</h2>
      {node.summary && <p className="mb-2 text-sm">{node.summary}</p>}
      <div className="mb-2 text-xs text-muted-foreground">
        Confidence: {Math.round((node.confidence ?? 0) * 100)}%
      </div>
      {node.logs && (
        <ul className="list-disc space-y-1 pl-4 text-sm">
          {node.logs.slice(0, 3).map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

