"use client";

import { motion } from "framer-motion";

interface Item {
  title: string;
  description: string;
}

export default function ValueProps() {
  const items: Item[] = [
    {
      title: "Transparent agents",
      description: "Every decision traced to its source.",
    },
    {
      title: "Evidence-linked picks",
      description: "Tap into the rationale behind every pick.",
    },
    {
      title: "Live accuracy",
      description: "Performance metrics update in real time.",
    },
  ];

  return (
    <motion.section
      className="grid gap-8 py-10 md:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
    >
      {items.map((item) => (
        <motion.div
          key={item.title}
          className="text-center"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
        >
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        </motion.div>
      ))}
    </motion.section>
  );
}

