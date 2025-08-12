"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="rounded-2xl border p-6 sm:p-8">
      <h2 className="text-xl font-semibold">How EdgePicks Works</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-3">
        <li className="rounded-lg border p-4">
          <div className="font-medium">1) We Pull Live Data</div>
          <p className="text-sm text-muted-foreground mt-1">Odds, stats, injuries, weather.</p>
        </li>
        <li className="rounded-lg border p-4">
          <div className="font-medium">2) Agents Debate</div>
          <p className="text-sm text-muted-foreground mt-1">Independent agents form picks + confidence.</p>
        </li>
        <li className="rounded-lg border p-4">
          <div className="font-medium">3) You Get Reasons</div>
          <p className="text-sm text-muted-foreground mt-1">Clear rationales behind every pick.</p>
        </li>
      </ol>

      {/* Mini funnel diagram */}
      <div className="mt-6 relative h-32">
        <motion.div
          className="absolute left-4 top-6 h-3 w-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.div
          className="absolute left-4 top-16 h-3 w-3 rounded-full bg-primary/70"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        />
        <motion.div
          className="absolute left-4 top-24 h-3 w-3 rounded-full bg-primary/60"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
        />
        <motion.div className="absolute left-12 top-14 h-2 w-28 rounded-md bg-muted" />
        <motion.div
          className="absolute left-44 top-14 h-6 w-6 rounded-full bg-primary"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <div className="absolute left-52 top-14 text-sm text-muted-foreground">Consensus</div>
      </div>
    </section>
  );
}

