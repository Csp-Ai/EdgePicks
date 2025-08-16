"use client";

import type { Role } from "@/lib/agents/roles";
import { ROLE_COLOR } from "@/lib/agents/roles";

interface Props {
  activeRoles: Role[];
  onToggle: (role: Role) => void;
}

const roles: Role[] = ["scout", "analyst", "model", "arbiter"];

export default function AgentLegend({ activeRoles, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => onToggle(r)}
          className={`flex items-center gap-1 rounded border px-2 py-1 text-[10px] ${
            activeRoles.includes(r) ? "opacity-100" : "opacity-40"
          }`}
          aria-pressed={activeRoles.includes(r)}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: ROLE_COLOR[r] }}
          />
          {r}
        </button>
      ))}
    </div>
  );
}

