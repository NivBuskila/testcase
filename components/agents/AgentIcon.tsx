import { Rocket, ShieldCheck, Compass, Swords, type LucideProps } from "lucide-react";
import type { AgentId } from "@/lib/types";

const ICONS: Record<AgentId, React.ComponentType<LucideProps>> = {
  visionary: Rocket,
  risk: ShieldCheck,
  pragmatist: Compass,
  devil: Swords,
};

export function AgentIcon({ agentId, ...props }: { agentId: AgentId } & LucideProps) {
  const Icon = ICONS[agentId];
  return <Icon strokeWidth={1.75} aria-hidden {...props} />;
}
