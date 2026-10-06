"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents";
import type { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "../agents/AgentAvatar";

export function TypingIndicator({ agentId }: { agentId: AgentId }) {
  const agent = AGENTS[agentId];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3"
      aria-live="polite"
    >
      <AgentAvatar agentId={agentId} size="sm" active />
      <div className={cn("flex items-center gap-2 rounded-2xl rounded-tl-sm border bg-slate-900/70 px-4 py-3", agent.border)}>
        <span className={cn("text-xs font-medium", agent.text)}>{agent.name} is thinking</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.hex }}
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
