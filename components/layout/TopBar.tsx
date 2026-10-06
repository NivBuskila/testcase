"use client";

import { Download, RotateCcw, Sparkles } from "lucide-react";
import type { DebateController } from "@/hooks/useDebate";
import { Button } from "../ui/Button";
import { truncate } from "@/lib/utils";

export function TopBar({ debate, onExport }: { debate: DebateController; onExport: () => void }) {
  const { dilemma, status, live, mode, setMode } = debate;
  const hasRun = status !== "idle";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-amber-400 shadow-glow">
          <Sparkles className="h-5 w-5 text-slate-950" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-wide text-white sm:text-base">DecisionForge AI</h1>
          {hasRun && dilemma && (
            <p dir="auto" className="truncate text-xs text-slate-400" title={dilemma}>
              {truncate(dilemma, 70)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs">
          <button
            onClick={() => setMode("mock")}
            title="Demo mode: a simulated debate, no API key needed"
            className={`rounded-md px-2.5 py-1 font-medium transition ${mode === "mock" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Mock (demo)
          </button>
          <button
            onClick={() => setMode("live")}
            disabled={!live.available}
            title={live.available ? `Live: real AI debate via ${live.provider}` : "Live: real AI debate. Add OPENAI_API_KEY or ANTHROPIC_API_KEY to enable"}
            className={`rounded-md px-2.5 py-1 font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${mode === "live" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Live
          </button>
        </div>
        {hasRun && (
          <>
            <Button size="sm" variant="outline" onClick={onExport} disabled={status !== "complete"}>
              <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={debate.reset}>
              <RotateCcw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reset</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
