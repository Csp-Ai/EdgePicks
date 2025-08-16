"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/60 py-32">
      <span
        className="grid-bg pointer-events-none absolute inset-0 -z-10"
        aria-label="Animated grid background"
        role="img"
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 text-center"
      >
        <motion.h1
          variants={item}
          className="text-4xl font-bold leading-tight sm:text-5xl"
        >
          AI-Powered Sports Picks, Made Transparent.
        </motion.h1>
        <motion.p variants={item} className="mt-4 text-lg text-muted-foreground">
          Our expert agents explain every pick with <span className="font-semibold">live</span> data and evidence you can audit.
        </motion.p>
        <motion.div
          variants={item}
          className="mt-8 flex justify-center gap-4"
        >
          <Link
            href="/predictions"
            className={buttonVariants({ variant: "primary" })}
            aria-label="See today's picks"
          >
            See Today’s Picks
          </Link>
          <Link
            href="/demo"
            className={buttonVariants({ variant: "ghost" })}
            aria-label="View live demo"
          >
            Live Demo
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

