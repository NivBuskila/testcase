"use client";

import { FastForward, MessagesSquare } from "lucide-react";
import { AGENT_ORDER } from "@/lib/agents";
import type { DebateController } from "@/hooks/useDebate";
import { AgentCard } from "../agents/AgentCard";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { ConstraintInjector } from "./ConstraintInjector";
import { DebateStream } from "./DebateStream";

export function DebatePanel({ debate }: { debate: DebateController }) {
  const { status, visible, totalMessages, typingAgent, stances, constraints } = debate;
  const assembling = status === "assembling";
  // Constraints can be injected mid-debate; only blocked while a request is in flight.
  const busy = assembling || status === "reevaluating";

  return (
    <GlassCard
      title="Live Debate"
      icon={<MessagesSquare className="h-4 w-4 text-red-300" />}
      className="flex h-full flex-col"
      action={
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-500">
            {visible.length}/{totalMessages || "–"}
          </span>
          {typingAgent && (
            <Button size="sm" variant="ghost" onClick={debate.skip}>
              <FastForward className="h-3.5 w-3.5" /> Skip
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-3 grid grid-cols-2 gap-2">
        {AGENT_ORDER.map((id, i) => (
          <AgentCard key={id} agentId={id} index={i} stance={stances[id]} active={typingAgent === id} />
        ))}
      </div>
      <DebateStream
        messages={visible}
        typingAgent={typingAgent}
        assembling={assembling}
        reevaluating={status === "reevaluating"}
      />
      <ConstraintInjector disabled={busy} used={constraints} onInject={debate.injectConstraint} />
    </GlassCard>
  );
}
