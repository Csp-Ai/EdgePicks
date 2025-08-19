"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { NodeObject, LinkObject } from "force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import AgentLegend from "@/components/AgentLegend";
import AgentLogPanel from "@/components/AgentLogPanel";
import type { Role } from "@/lib/agents/roles";
import { ROLE_COLOR } from "@/lib/agents/roles";
import type { Adapter } from "@/lib/agents/dataAdapter";
import { demoAdapter, liveAdapter } from "@/lib/agents/dataAdapter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
}) as unknown as React.ComponentType<any>;

export interface AgentNode extends NodeObject {
  id: string;
  label: string;
  role: Role;
  confidence: number;
  summary?: string;
  logs?: string[];
}

export interface AgentLink extends LinkObject<AgentNode> {
  source: string | AgentNode;
  target: string | AgentNode;
  confidence: number;
}


type Props = { adapter?: Adapter };

export default function AgentFlowVisualizer({ adapter }: Props) {
  const [graph, setGraph] = useState<{ nodes: AgentNode[]; links: AgentLink[] } | null>(null);
  const [selected, setSelected] = useState<AgentNode | null>(null);
  const [force, setForce] = useState(60);
  const [showArrows, setShowArrows] = useState(true);
  const [roles, setRoles] = useState<Role[]>(["scout", "analyst", "model", "arbiter"]);
  const [width, setWidth] = useState<number>(0);
  const fgRef = useRef<ForceGraphMethods>();
  const frame = useRef<number>();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"live" | "demo">(() => {
    const param = searchParams?.get("mode");
    if (param === "live" || param === "demo") return param;
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || pathname.startsWith("/demo-0to1")) {
      return "demo";
    }
    return "live";
  });

  const activeAdapter = adapter ?? (mode === "demo" ? demoAdapter : liveAdapter);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    (async () => {
      try {
        const snap = await activeAdapter.snapshot({ demo: mode === "demo" });
        if (!cancelled) setGraph({ nodes: snap.nodes as AgentNode[], links: snap.edges as AgentLink[] });
      } catch {
        // ignore snapshot errors
      }
      try {
        for await (const ev of activeAdapter.stream({ demo: mode === "demo", signal: ctrl.signal })) {
          if (cancelled) break;
          setGraph((prev) => {
            const base = prev ?? { nodes: [], links: [] };
            if (ev.type === "node") {
              return { ...base, nodes: [...base.nodes, ev.payload] };
            }
            if (ev.type === "edge") {
              return { ...base, links: [...base.links, ev.payload] };
            }
            return base;
          });
        }
      } catch {
        // stream ended
      }
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [activeAdapter, mode]);

  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const filtered = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    const nodes = graph.nodes.filter((n) => roles.includes(n.role));
    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = graph.links.filter(
      (l) =>
        nodeIds.has(typeof l.source === "string" ? l.source : l.source.id) &&
        nodeIds.has(typeof l.target === "string" ? l.target : l.target.id),
    );
    return { nodes, links };
  }, [graph, roles]);

  const nodeCanvasObject = useMemo(
    () =>
      function (n: AgentNode, ctx: CanvasRenderingContext2D, scale: number) {
        const size = 4 + (n.confidence ?? 0.5) * 8;
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = ROLE_COLOR[n.role];
        ctx.fill();
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
        const size = 4 + (n.confidence ?? 0.5) * 8;
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
      },
    [],
  );

  const refresh = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => (fgRef.current as any)?.refresh?.());
  }, []);

  useEffect(() => {
    refresh();
  }, [roles, showArrows, force, refresh]);

  useEffect(() => {
    (fgRef.current?.d3Force("charge") as any)?.strength(-force);
  }, [force]);

  const toggleRole = (r: Role) => {
    setRoles((prev) => (prev.includes(r) ? prev.filter((p) => p !== r) : [...prev, r]));
  };

  const resetCamera = () => {
    fgRef.current?.zoomToFit(400);
  };

  if (width && width < 640) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border p-4 text-center text-sm text-muted-foreground">
        Rotate your device or use desktop to explore the agent graph.
      </div>
    );
  }

  if (!graph) {
    return <div className="h-64" />;
  }

  const toggleMode = () => {
    const next = mode === "live" ? "demo" : "live";
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("mode", next);
    router.replace(`${pathname}?${params.toString()}`);
    setMode(next);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMode}
        className="absolute left-2 top-2 z-10 rounded border bg-background/80 px-2 py-1 text-xs shadow"
      >
        {mode === "live" ? "View in Demo mode" : "View in Live mode"}
      </button>
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
        width={width}
        height={500}
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
        <button
          onClick={resetCamera}
          className="rounded border px-2 py-1"
          aria-label="Reset graph view"
        >
          Reset
        </button>
        <AgentLegend activeRoles={roles} onToggle={toggleRole} />
      </div>
      <AgentLogPanel node={selected} onClose={() => setSelected(null)} />
      <div data-testid="edge-count" className="hidden">
        {filtered.links.length}
      </div>
    </div>
  );
}

