"use client";
import React from 'react';
import AgentLogStream from '@/components/AgentLogStream';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const AgentLogsPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Agent Logs</h1>
        <p className="text-gray-600">Real-time agent reflections</p>
      </header>
      <AgentLogStream />
    </main>
  );
};

export default AgentLogsPage;

