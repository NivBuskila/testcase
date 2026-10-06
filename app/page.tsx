"use client";

import { useState } from "react";
import { DebatePanel } from "@/components/debate/DebatePanel";
import { RiskRadar } from "@/components/analytics/RiskRadar";
import { RiskRewardMeter } from "@/components/analytics/RiskRewardMeter";
import { DecisionTree } from "@/components/tree/DecisionTree";
import { SynthesisPanel } from "@/components/synthesis/SynthesisPanel";
import { ExecutiveSummaryModal } from "@/components/synthesis/ExecutiveSummaryModal";
import { PrintReport } from "@/components/PrintReport";
import { DilemmaForm } from "@/components/DilemmaForm";
import { TopBar } from "@/components/layout/TopBar";
import { AgentManager } from "@/components/agents/AgentManager";
import { useDebate } from "@/hooks/useDebate";

export default function Home() {
  const debate = useDebate();
  const [reportOpen, setReportOpen] = useState(false);
  const { status, dilemma, result, visible, scores, synthesis, synthesisReady, error, dismissError, start } = debate;

  const handleExport = () => {
    setReportOpen(false);
    requestAnimationFrame(() => window.print());
  };

  if (status === "idle") {
    return (
      <div className="flex min-h-screen flex-col print:hidden">
        <TopBar debate={debate} onExport={handleExport} />
        <DilemmaForm loading={false} error={error} onSubmit={start} />
        <AgentManager />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col print:hidden">
        <TopBar debate={debate} onExport={handleExport} />

        {error && (
          <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200 sm:mx-6">
            <span>{error}</span>
            <button onClick={dismissError} className="shrink-0 text-rose-300 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-5 lg:p-6">
          <div className="lg:col-span-2">
            <DebatePanel debate={debate} />
          </div>
          <div className="space-y-4 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <RiskRadar base={result?.baseScores ?? null} current={scores} />
              <RiskRewardMeter scores={scores} />
            </div>
            <DecisionTree tree={result?.tree ?? null} />
            <SynthesisPanel synthesis={synthesis} ready={synthesisReady} onOpenReport={() => setReportOpen(true)} />
          </div>
        </main>
      </div>

      <ExecutiveSummaryModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onExport={handleExport}
        dilemma={dilemma}
        synthesis={synthesis}
        scores={scores}
      />

      <PrintReport dilemma={dilemma} messages={visible} scores={scores} synthesis={synthesisReady ? synthesis : null} tree={result?.tree ?? null} />
    </div>
  );
}
