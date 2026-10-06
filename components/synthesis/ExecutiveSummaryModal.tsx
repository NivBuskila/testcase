"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { AlertTriangle, Download, X, Zap } from "lucide-react";
import { RADAR_AXES } from "@/lib/agents";
import { riskReward } from "@/lib/scoring";
import type { RadarScores, Synthesis } from "@/lib/types";
import { Button } from "../ui/Button";
import { ConfidenceRing } from "./ConfidenceRing";
import { VerdictBadge } from "./VerdictBadge";

interface ExecutiveSummaryModalProps {
  open: boolean;
  onClose: () => void;
  onExport: () => void;
  dilemma: string;
  synthesis: Synthesis | null;
  scores: RadarScores | null;
}

export function ExecutiveSummaryModal({ open, onClose, onExport, dilemma, synthesis, scores }: ExecutiveSummaryModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const rr = scores ? riskReward(scores) : null;

  return (
    <AnimatePresence>
      {open && synthesis && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exec-summary-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-red-300">Executive summary</p>
                <h2 id="exec-summary-title" dir="auto" className="mt-1 text-lg font-semibold text-white">
                  {dilemma}
                </h2>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
              <ConfidenceRing value={synthesis.confidence} />
              <div>
                <VerdictBadge verdict={synthesis.verdict} />
                <p dir="auto" className="mt-2 text-sm font-medium text-slate-100">
                  {synthesis.headline}
                </p>
              </div>
            </div>

            <p dir="auto" className="mt-4 text-sm leading-relaxed text-slate-300">
              {synthesis.summary}
            </p>

            {scores && rr && (
              <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {RADAR_AXES.map(({ key, label }) => (
                  <div key={key} className="rounded-lg bg-slate-950/50 p-2 text-center">
                    <p className="font-mono text-lg font-bold text-red-300">{scores[key]}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            )}

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Action plan</h3>
            <ol className="mt-2 space-y-2">
              {synthesis.steps.map((s, i) => (
                <li key={`${s.title}-${i}`} className="flex gap-3 text-sm">
                  <span className="font-mono text-red-300">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p dir="auto" className="font-medium text-slate-100">
                      {s.title} <span className="font-mono text-xs text-red-300/80">· {s.timeframe}</span>
                    </p>
                    <p dir="auto" className="text-xs text-slate-400">
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {synthesis.keyRisks.length > 0 && (
              <>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Key risks to watch</h3>
                <ul className="mt-2 space-y-1.5">
                  {synthesis.keyRisks.map((r) => (
                    <li key={r} dir="auto" className="flex items-start gap-2 text-sm text-slate-300">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" /> {r}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {synthesis.constraintsApplied.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {synthesis.constraintsApplied.map((c) => (
                  <span key={c} dir="auto" className="inline-flex items-center gap-1 rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-1 text-[11px] text-red-200">
                    <Zap className="h-3 w-3" /> {c}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onExport}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
