"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import { Loader2, Zap } from "lucide-react";
import type { AgentId, DebateMessage } from "@/lib/types";
import { Skeleton } from "../ui/Skeleton";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface DebateStreamProps {
  messages: DebateMessage[];
  typingAgent: AgentId | null;
  assembling: boolean;
  reevaluating: boolean;
}

function ConstraintDivider({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/50" />
      <span dir="auto" className="flex max-w-[80%] items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200">
        <Zap className="h-3 w-3 shrink-0" />
        <span className="truncate">Constraint injected: {text}</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/50" />
    </motion.div>
  );
}

function StreamSkeleton() {
  return (
    <div className="space-y-5" aria-label="Assembling agents">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DebateStream({ messages, typingAgent, assembling, reevaluating }: DebateStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typingAgent, reevaluating]);

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2 [scrollbar-width:thin]">
      {assembling && <StreamSkeleton />}
      {messages.map((m, i) => (
        <Fragment key={m.id}>
          {m.constraint && m.constraint !== messages[i - 1]?.constraint && <ConstraintDivider text={m.constraint} />}
          <MessageBubble message={m} />
        </Fragment>
      ))}
      <AnimatePresence>
        {typingAgent && <TypingIndicator key={`typing-${messages.length}`} agentId={typingAgent} />}
      </AnimatePresence>
      {reevaluating && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-amber-200">
          <Loader2 className="h-4 w-4 animate-spin" /> Agents are re-evaluating under the new constraint…
        </div>
      )}
    </div>
  );
}
