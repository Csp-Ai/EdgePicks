import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/60 py-20">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Smarter Sports Picks, <span className="text-primary">Explained</span>.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Transparent AI agents delivering evidence‑linked predictions.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/predictions" className={buttonVariants({ variant: "primary" })}>
            See Today’s Predictions
          </Link>
          <Link href="/demo" className={buttonVariants({ variant: "ghost" })}>
            Live Demo
          </Link>
        </div>
        <div className="mt-10 flex justify-center gap-8 opacity-60">
          <div className="h-8 w-20 rounded bg-white/20" />
          <div className="h-8 w-20 rounded bg-white/20" />
          <div className="h-8 w-20 rounded bg-white/20" />
        </div>
      </div>
    </section>
  );
}
