"use client";

import { useState } from 'react';
import nextDynamic from 'next/dynamic';
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const AgentFlowVisualizer = nextDynamic(() => import('@/components/AgentFlowVisualizer'), { ssr: false });

export default function Page() {
  const [show, setShow] = useState(false);
  return (
    <div className="p-4">
      {show ? (
        <AgentFlowVisualizer />
      ) : (
        <button
          className="rounded border px-4 py-2"
          onClick={() => setShow(true)}
        >
          Show Live Agent Network
        </button>
      )}
    </div>
  );
}
