"use client";

import { forwardRef } from "react";
import { ChevronRight, GitBranch, Target } from "lucide-react";
import type { TreeNode } from "@/lib/types";
import { cn, truncate } from "@/lib/utils";

interface TreeNodeButtonProps {
  node: TreeNode;
  selected: boolean;
  expanded?: boolean;
  onClick: () => void;
}

const KIND_STYLES: Record<TreeNode["kind"], string> = {
  root: "border-cyan-400/50 bg-cyan-400/10 w-44",
  option: "border-white/15 bg-slate-800/70 w-44",
  outcome: "border-white/10 bg-slate-900/80 w-48",
};

export const TreeNodeButton = forwardRef<HTMLButtonElement, TreeNodeButtonProps>(function TreeNodeButton(
  { node, selected, expanded, onClick },
  ref,
) {
  const p = node.probability;
  const barColor = p === undefined ? "" : p >= 55 ? "bg-emerald-400" : p >= 40 ? "bg-amber-400" : "bg-rose-400";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-expanded={node.kind === "option" ? expanded : undefined}
      title={node.label}
      className={cn(
        "group relative shrink-0 rounded-xl border p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/60",
        KIND_STYLES[node.kind],
        selected && "border-cyan-300 shadow-glow",
      )}
    >
      <div className="flex items-start gap-1.5">
        {node.kind === "root" && <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />}
        {node.kind === "option" && <GitBranch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />}
        <span dir="auto" className="flex-1 text-xs font-medium leading-snug text-slate-100">
          {truncate(node.label, node.kind === "root" ? 80 : 48)}
        </span>
        {node.kind === "option" && (
          <ChevronRight className={cn("mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform", expanded && "rotate-90")} />
        )}
      </div>
      {p !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className={cn("h-full rounded-full", barColor)} style={{ width: `${p}%` }} />
          </div>
          <span className="font-mono text-[10px] text-slate-400">{p}%</span>
        </div>
      )}
    </button>
  );
});
