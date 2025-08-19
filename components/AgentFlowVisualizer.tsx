"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import type { NodeObject, LinkObject } from "force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { demoGraph } from "@/lib/agents/demoGraph";
import AgentLegend from "@/components/AgentLegend";
import AgentLogPanel from "@/components/AgentLogPanel";
import type { Role } from "@/lib/agents/roles";
import { ROLE_COLOR, ROLE_DASH } from "@/lib/agents/roles";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
}) as unknown as React.ComponentType<any>;

export interface AgentNode extends NodeObject {
  id: string;
  label: string;
  role: Role;
  confidence: number;
  status?: string;
  summary?: string;
  logs?: string[];
}

export interface AgentLink extends LinkObject<AgentNode> {
  source: string | AgentNode;
  target: string | AgentNode;
  confidence: number;
}


export default function AgentFlowVisualizer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 500 });
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      requestAnimationFrame(() => setSize({ w: Math.round(width), h: 500 }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const initialRoles: Role[] = searchParams?.get("roles")
    ? (searchParams.get("roles")!.split(",") as Role[])
    : ["scout", "analyst", "model", "arbiter"];
  const initialMode = (searchParams?.get("mode") as "all" | "active" | "role") || "all";
  const initialZoom = parseFloat(searchParams?.get("zoom") || "1");
  const [graph, setGraph] = useState<{ nodes: AgentNode[]; links: AgentLink[] } | null>(null);
  const [selected, setSelected] = useState<AgentNode | null>(null);
  const [force, setForce] = useState(60);
  const [showArrows, setShowArrows] = useState(true);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"all" | "active" | "role">(initialMode);
  const [zoom, setZoom] = useState(initialZoom);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const fgRef = useRef<ForceGraphMethods>();
  const frame = useRef<number>();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/agent-graph");
        if (!res.ok) throw new Error("bad");
        const data = (await res.json()) as { nodes: AgentNode[]; links: AgentLink[] };
        if (active) setGraph(data);
      } catch {
        if (active) setGraph(demoGraph);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setPrefersReduced(mql.matches);
    set();
    mql.addEventListener("change", set);
    return () => mql.removeEventListener("change", set);
  }, []);

  const filtered = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    let nodes = graph.nodes;
    if (mode === "active") {
      nodes = nodes.filter((n) => (n.logs?.length || 0) > 0);
    } else if (mode === "role") {
      nodes = nodes.filter((n) => roles.includes(n.role));
    }
    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = graph.links.filter(
      (l) =>
        nodeIds.has(typeof l.source === "string" ? l.source : l.source.id) &&
        nodeIds.has(typeof l.target === "string" ? l.target : l.target.id),
    );
    return { nodes, links };
  }, [graph, roles, mode]);

  const nodeCanvasObject = useMemo(
    () =>
      function (n: AgentNode, ctx: CanvasRenderingContext2D, scale: number) {
        const size = 4 + (n.confidence ?? 0.5) * 8;
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = ROLE_COLOR[n.role];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.setLineDash(ROLE_DASH[n.role]);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.setLineDash([]);
        if (scale > 1.6) {
          ctx.font = `${Math.max(8, size + 4)}px Inter, system-ui`;
          ctx.textAlign = "center";
          ctx.fillStyle = "#e5e7eb";
          ctx.fillText(n.label, n.x!, n.y! - size - 2);
        }
      },
    [],
  );

  const nodePointerAreaPaint = useMemo(
    () =>
      function (n: AgentNode, color: string, ctx: CanvasRenderingContext2D) {
        const size = Math.max(20, 4 + (n.confidence ?? 0.5) * 8);
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
      },
    [],
  );

  const refresh = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const current: any = fgRef.current;
      if (current && typeof current.refresh === "function") current.refresh();
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [roles, showArrows, force, paused, refresh]);

  useEffect(() => {
    (fgRef.current?.d3Force("charge") as any)?.strength(-force);
  }, [force]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) fgRef.current?.pauseAnimation();
    else fgRef.current?.resumeAnimation();
  }, [paused]);
  useEffect(() => {
    const current: any = fgRef.current;
    if (!current || typeof current.d3Zoom !== "function") return;
    const zoomObj = current.d3Zoom();
    const handle = (event: any) => setZoom(event.transform.k);
    zoomObj.on("zoom", handle);
    return () => zoomObj.on("zoom", null);
  }, [filtered]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (mode === "role") params.set("roles", roles.join(","));
    params.set("zoom", zoom.toFixed(2));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [mode, roles, zoom, router]);

  const appliedInitialZoom = useRef(false);
  useEffect(() => {
    if (!appliedInitialZoom.current && fgRef.current) {
      fgRef.current.zoom(zoom);
      appliedInitialZoom.current = true;
    }
  }, [zoom, size.w, size.h]);

  const toggleRole = (r: Role) => {
    setRoles((prev) => (prev.includes(r) ? prev.filter((p) => p !== r) : [...prev, r]));
  };

  const resetCamera = () => {
    fgRef.current?.zoomToFit(400);
  };

  if (!graph) {
    return <div className="h-64" />;
  }
  return (
    <div ref={containerRef} className="relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={filtered}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={nodePointerAreaPaint}
        linkDirectionalArrowLength={showArrows ? 4 : 0}
        linkDirectionalArrowRelPos={1}
        linkWidth={(l: AgentLink) => 1 + (l.confidence ?? 0.5) * 2}
        nodeLabel={(n: AgentNode) => `${n.label} (${n.role}, ${Math.round(n.confidence * 100)}%)`}
        onNodeClick={(n: AgentNode) => setSelected(n)}
        width={size.w}
        height={size.h}
        cooldownTicks={prefersReduced ? 0 : undefined}
      />
      <div className="absolute top-2 right-2 space-y-2 rounded-md bg-background/80 p-3 text-xs shadow">
        <label className="flex items-center gap-2">
          <span>Force</span>
          <input
            type="range"
            min={10}
            max={200}
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            className="w-24"
            aria-label="Force strength"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showArrows}
            onChange={(e) => setShowArrows(e.target.checked)}
            aria-label="Toggle link arrows"
          />
          <span>Link arrows</span>
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="rounded border px-1 py-0.5"
          aria-label="Graph density"
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="role">By Role</option>
        </select>
        {mode === "role" && <AgentLegend activeRoles={roles} onToggle={toggleRole} />}
        <button
          onClick={() => setPaused((p) => !p)}
          role="switch"
          aria-checked={!paused}
          className="rounded border px-2 py-1 focus-visible:ring-2 ring-offset-2"
        >
          {paused ? 'Resume motion' : 'Pause motion'}
        </button>
        <button
          onClick={resetCamera}
          className="rounded border px-2 py-1 focus-visible:ring-2 ring-offset-2"
          aria-label="Reset graph view"
        >
          Reset
        </button>
      </div>
      <table className="sr-only" aria-hidden={false}>
        <caption>Agent network summary</caption>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Role</th>
            <th>Status</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {filtered.nodes.map((n) => (
            <tr
              key={n.id}
              tabIndex={0}
              className="focus-visible:ring-2 ring-offset-2 outline-none"
              onClick={() => setSelected(n)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(n);
                }
              }}
            >
              <td>{n.label}</td>
              <td>{n.role}</td>
              <td>{n.status ?? 'unknown'}</td>
              <td>{Math.round((n.confidence ?? 0) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AgentLogPanel node={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

