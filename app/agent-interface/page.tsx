import UniversalAgentInterface from "@/components/universal/UniversalAgentInterface";
import { registry } from "@/lib/agents/registry";
import { flags } from "@/lib/flags/experiments";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function toClientSafeRegistry(reg: any) {
  const stripFunctions = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(stripFunctions);
    if (obj && typeof obj === "object") {
      const out: any = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "function") continue;
        out[k] = stripFunctions(v);
      }
      return out;
    }
    return obj;
  };
  return stripFunctions(reg);
}

export default async function Page() {
  if (!flags.agentInterface) {
    return <div className="p-4 text-center">Agent interface not enabled.</div>;
  }

  const clientSafeAgents = toClientSafeRegistry(
    Object.fromEntries(
      registry.map((agent) => [
        agent.name,
        {
          id: agent.name,
          name: agent.name,
          description: agent.description ?? "",
          weight: agent.weight ?? 1,
          tags: (agent as any).tags ?? [],
        },
      ])
    )
  );

  return <UniversalAgentInterface agents={clientSafeAgents} />;
}

