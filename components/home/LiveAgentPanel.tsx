"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const AgentNetwork = dynamic(() => import("@/components/visuals/AgentNetwork"), { ssr: false });

export default function LiveAgentPanel() {
  return (
    <section aria-labelledby="live-agents" className="relative rounded-2xl border">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 id="live-agents" className="text-xl font-semibold">Live Agent Network</h2>
        <Link href="/leaderboard" className="text-sm text-muted-foreground hover:underline">
          Accuracy & Leaderboard →
        </Link>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2 min-h-[280px]">
          <AgentNetwork />
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Status</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 font-medium"
          >
            Agents analyzing current matchups…
          </motion.div>
          <p className="mt-2 text-sm text-muted-foreground">
            Hover nodes to see which data each specialist is inspecting.
          </p>
        </div>
      </div>
    </section>
  );
}

