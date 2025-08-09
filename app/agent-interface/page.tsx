import UniversalAgentInterface from "@/components/universal/UniversalAgentInterface";
import { SportsAdapter } from "@/components/universal/adapters/SportsAdapter";
import { flags } from "@/lib/flags/experiments";

export default function Page() {
  if (!flags.agentInterface) {
    return <div className="p-4 text-center">Agent interface not enabled.</div>;
  }
  return <UniversalAgentInterface adapter={SportsAdapter} />;
}
