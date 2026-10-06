"use client";

import { motion } from "framer-motion";
import { CornerDownRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { AGENTS, RADAR_AXES } from "@/lib/agents";
import type { DebateMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "../agents/AgentAvatar";

function SentimentChip({ sentiment }: { sentiment: number }) {
  if (sentiment > 0.15)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
        <TrendingUp className="h-3 w-3" /> For
      </span>
    );
  if (sentiment < -0.15)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
        <TrendingDown className="h-3 w-3" /> Against
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-400/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
      <Minus className="h-3 w-3" /> Neutral
    </span>
  );
}

export function MessageBubble({ message }: { message: DebateMessage }) {
  const agent = AGENTS[message.agentId];
  const impacts = RADAR_AXES.filter(({ key }) => message.impact[key]).map(({ key, label }) => ({
    label,
    value: message.impact[key] as number,
  }));

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="flex gap-3"
    >
      <AgentAvatar agentId={message.agentId} size="sm" />
      <div className={cn("min-w-0 flex-1 rounded-2xl rounded-tl-sm border bg-slate-900/70 p-3.5", agent.border)}>
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className={cn("text-sm font-semibold", agent.text)}>{agent.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", agent.bg, agent.text)}>{agent.title}</span>
          <SentimentChip sentiment={message.sentiment} />
        </div>
        {message.replyTo && (
          <p className="mb-1 flex items-center gap-1 text-[11px] text-slate-500">
            <CornerDownRight className="h-3 w-3" /> replying to {AGENTS[message.replyTo].name}
          </p>
        )}
        <p dir="auto" className="text-sm leading-relaxed text-slate-200">
          {message.content}
        </p>
        {impacts.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {impacts.map((i) => (
              <span
                key={i.label}
                className={cn(
                  "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                  i.value > 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300",
                )}
              >
                {i.label} {i.value > 0 ? "+" : ""}
                {i.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
