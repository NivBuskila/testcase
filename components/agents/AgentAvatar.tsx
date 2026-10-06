"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents";
import type { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  agentId: AgentId;
  active?: boolean;
  size?: "sm" | "md";
}

export function AgentAvatar({ agentId, active = false, size = "md" }: AgentAvatarProps) {
  const agent = AGENTS[agentId];
  const dims = size === "sm" ? "h-8 w-8 text-base" : "h-11 w-11 text-xl";
  return (
    <div className="relative shrink-0">
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 0 2px ${agent.hex}` }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.div
        animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={active ? { duration: 1.2, repeat: Infinity } : undefined}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-offset-2 ring-offset-slate-950",
          agent.gradient,
          active ? agent.ring : "ring-white/10",
          dims,
        )}
        aria-hidden
      >
        <span className="drop-shadow">{agent.emoji}</span>
      </motion.div>
    </div>
  );
}
