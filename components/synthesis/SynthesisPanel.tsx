"use client";

import { motion } from "framer-motion";
import { FileText, Loader2, Scale } from "lucide-react";
import type { Synthesis } from "@/lib/types";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { Skeleton } from "../ui/Skeleton";
import { ConfidenceRing } from "./ConfidenceRing";
import { VerdictBadge } from "./VerdictBadge";

interface SynthesisPanelProps {
  synthesis: Synthesis | null;
  ready: boolean;
  onOpenReport: () => void;
}

export function SynthesisPanel({ synthesis, ready, onOpenReport }: SynthesisPanelProps) {
  return (
    <GlassCard
      title="Final Synthesis"
      icon={<Scale className="h-4 w-4 text-red-300" />}
      action={
        ready && synthesis ? (
          <Button size="sm" variant="outline" onClick={onOpenReport}>
            <FileText className="h-3.5 w-3.5" /> Executive summary
          </Button>
        ) : null
      }
    >
      {!ready || !synthesis ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for the panel to reach consensus…
          </div>
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-4">
            <ConfidenceRing value={synthesis.confidence} />
            <div className="min-w-0 flex-1">
              <VerdictBadge verdict={synthesis.verdict} />
              <p dir="auto" className="mt-2 text-base font-semibold text-white">
                {synthesis.headline}
              </p>
            </div>
          </div>
          <p dir="auto" className="mt-4 text-sm leading-relaxed text-slate-300">
            {synthesis.summary}
          </p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {synthesis.steps.map((step, i) => (
              <motion.li
                key={`${step.title}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="rounded-xl border border-white/10 bg-slate-950/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400/15 font-mono text-[10px] text-red-300">
                      {i + 1}
                    </span>
                    <span dir="auto">{step.title}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-red-300/80">{step.timeframe}</span>
                </div>
                <p dir="auto" className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {step.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      )}
    </GlassCard>
  );
}
