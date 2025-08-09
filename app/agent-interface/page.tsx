import UniversalAgentInterface from "@/components/universal/UniversalAgentInterface";
import { SportsAdapter } from "@/components/universal/adapters/SportsAdapter";
import Guard from "@/components/system/Guard";

export default function Page() {
  // For now, rely on demo mode inside the component; pass a streamUrl later if needed.
  return (
    <Guard flag="agentInterface" fallback={null}>
      <UniversalAgentInterface adapter={SportsAdapter} />
    </Guard>
  );
}
