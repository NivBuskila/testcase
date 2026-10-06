"use client";

import { Download, RotateCcw, Sparkles } from "lucide-react";
import type { DebateController } from "@/hooks/useDebate";
import { Button } from "../ui/Button";
import { truncate } from "@/lib/utils";

export function TopBar({ debate, onExport }: { debate: DebateController; onExport: () => void }) {
  const { dilemma, status, live, mode, setMode } = debate;
  const hasRun = status !== "idle";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border border-[#e95c24] bg-[linear-gradient(105deg,#f97316_0%,#f04c24_52%,#e11d48_100%)] bg-[length:160%_160%] px-4 py-3 text-white shadow-[0_2px_5px_#7c2d1240] [animation:sunset_8s_ease-in-out_infinite_alternate] sm:px-6">
      <style>{`@keyframes sunset{0%{background-position:0% 50%}100%{background-position:100% 50%}}`}</style>
      <div className="flex min-w-0 items-center gap-3">
        <Sparkles className="h-6 w-6 shrink-0 fill-current text-[#431407] drop-shadow-[0_1px_1px_#fff5]" />
        <div className="min-w-0">
          <h1 className="text-sm font-extrabold tracking-[0.015em] text-white sm:text-base">DecisionForge AI</h1>
          {hasRun && dilemma && (
            <p dir="auto" className="truncate text-xs text-orange-50/90" title={dilemma}>
              {truncate(dilemma, 70)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-full border border-[#fff9] bg-white p-0.5 shadow-[0_1px_3px_#7c2d1233]">
          <button
            onClick={() => setMode("mock")}
            type="button"
            className={`rounded-full border-0 bg-transparent px-2.5 py-[3px] text-[11px] font-semibold leading-none text-[#7c2d12] transition-[background-color,color,box-shadow,transform] duration-[180ms] ease-in-out hover:bg-[#ffedd5] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#431407] ${mode === "mock" ? "!bg-[#431407] !text-white shadow-[0_1px_3px_#43140755] hover:!bg-[#5b1d08]" : ""}`}
          >
            Mock
          </button>
          <button
            onClick={() => setMode("live")}
            disabled={!live.available}
            title={live.available ? `Live via ${live.provider}` : "Add OPENAI_API_KEY or ANTHROPIC_API_KEY to enable"}
            type="button"
            className={`rounded-full border-0 bg-transparent px-2.5 py-[3px] text-[11px] font-semibold leading-none text-[#7c2d12] transition-[background-color,color,box-shadow,transform] duration-[180ms] ease-in-out hover:bg-[#ffedd5] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#431407] disabled:cursor-not-allowed disabled:opacity-40 ${mode === "live" ? "!bg-[#431407] !text-white shadow-[0_1px_3px_#43140755] hover:!bg-[#5b1d08]" : ""}`}
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
