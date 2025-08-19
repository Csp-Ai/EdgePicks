"use client";

import type { Role } from "@/lib/agents/roles";
import { ROLE_COLOR, ROLE_PATTERN } from "@/lib/agents/roles";

interface Props {
  activeRoles: Role[];
  onToggle: (role: Role) => void;
}

const roles: Role[] = ["scout", "analyst", "model", "arbiter"];

export default function AgentLegend({ activeRoles, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Toggle agent roles">
      {roles.map((r) => {
        const on = activeRoles.includes(r);
        return (
          <button
            key={r}
            role="switch"
            aria-checked={on}
            aria-label={`Toggle ${r}`}
            onClick={() => onToggle(r)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm border focus-visible:ring-2 ring-offset-2 ${
              on ? "opacity-100" : "opacity-50"
            }`}
          >
            <span
              className="inline-block w-3 h-3 rounded-full border-2"
              style={{ background: ROLE_COLOR[r], borderStyle: ROLE_PATTERN[r] }}
            />
            <span className="font-medium">{r}</span>
            <span className="sr-only">{on ? "on" : "off"}</span>
          </button>
        );
      })}
    </div>
  );
}

