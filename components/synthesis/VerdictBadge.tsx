import type { Verdict } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<Verdict, string> = {
  GO: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200",
  "GO WITH CONDITIONS": "border-cyan-400/50 bg-cyan-400/15 text-cyan-200",
  WAIT: "border-amber-400/50 bg-amber-400/15 text-amber-200",
  "NO-GO": "border-rose-400/50 bg-rose-400/15 text-rose-200",
};

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-bold tracking-wider", STYLES[verdict], className)}>
      {verdict}
    </span>
  );
}
