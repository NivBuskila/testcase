"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents";
import { stanceLabel } from "@/lib/scoring";
import type { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "./AgentAvatar";
import { VoiceWave } from "./VoiceWave";

interface AgentCardProps {
  agentId: AgentId;
  stance: number;
  active: boolean;
  index: number;
}

export function AgentCard({ agentId, stance, active, index }: AgentCardProps) {
  const agent = AGENTS[agentId];
  // Map -100..100 onto 0..100% of the meter width.
  const position = (stance + 100) / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "rounded-xl border bg-slate-900/60 p-3 transition-colors duration-300",
        active ? cn(agent.border, agent.bg) : "border-white/10",
      )}
    >
      <div className="flex items-center gap-3">
        <AgentAvatar agentId={agentId} active={active} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-white">{agent.name}</p>
            <VoiceWave color={agent.hex} active={active} />
          </div>
          <p className={cn("truncate text-[11px] font-medium", agent.text)}>{agent.title}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="relative h-1.5 rounded-full bg-gradient-to-r from-rose-500/40 via-slate-600/40 to-red-500/40">
          <motion.span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-950"
            style={{ backgroundColor: agent.hex }}
            animate={{ left: `${position}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          />
        </div>
        <p className="mt-1.5 text-[10px] uppercase tracking-wider text-slate-500">{stanceLabel(stance)}</p>
      </div>
    </motion.div>
  );
}
