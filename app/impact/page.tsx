"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import data from "./metrics.json";
import { Card } from "@/components/ui/card";

interface MetricRecord {
  category: string;
  date: string;
  usersHelped: number;
  timeSaved: number;
  co2Saved: number;
  accuracy: number;
}

const metrics = data as MetricRecord[];
const categories = Array.from(new Set(metrics.map((m) => m.category)));

export default function ImpactDashboard() {
  const [selected, setSelected] = useState<string>("All");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return selected === "All"
      ? metrics
      : metrics.filter((m) => m.category === selected);
  }, [selected]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, cur) => {
          acc.usersHelped += cur.usersHelped;
          acc.timeSaved += cur.timeSaved;
          acc.co2Saved += cur.co2Saved;
          acc.accuracy += cur.accuracy;
          return acc;
        },
        { usersHelped: 0, timeSaved: 0, co2Saved: 0, accuracy: 0 }
      ),
    [filtered]
  );

  const avgAccuracy = filtered.length
    ? totals.accuracy / filtered.length
    : 0;

  const accuracyData = filtered.map((m) => ({
    date: m.date,
    accuracy: m.accuracy,
  }));

  const handleSelect = (category: string) => {
    startTransition(() => {
      setSelected(category);
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2">
        {["All", ...categories].map((c) => (
          <motion.button
            key={c}
            onClick={() => handleSelect(c)}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: selected === c ? "#2563eb" : "#1f2937",
              color: selected === c ? "#fff" : "#9ca3af",
            }}
            className="px-3 py-1 rounded-md border border-gray-700"
          >
            {c}
          </motion.button>
        ))}
      </div>
      <motion.div
        key={selected}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="text-center">
          <div className="text-sm text-gray-400">Users Helped</div>
          <div className="text-2xl font-bold">{totals.usersHelped}</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm text-gray-400">Time Saved (hrs)</div>
          <div className="text-2xl font-bold">{totals.timeSaved}</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm text-gray-400">CO₂ Saved (kg)</div>
          <div className="text-2xl font-bold">{totals.co2Saved}</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm text-gray-400">Avg Accuracy</div>
          <div className="text-2xl font-bold">
            {(avgAccuracy * 100).toFixed(1)}%
          </div>
        </Card>
      </motion.div>
      <Card>
        <div className="text-sm text-gray-400 mb-2">Accuracy Trail</div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} />
              <Tooltip formatter={(v) => `${Number(v) * 100}%`} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      {isPending && <div className="text-sm text-gray-400">Updating...</div>}
    </div>
  );
}
