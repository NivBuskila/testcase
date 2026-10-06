import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function GlassCard({ title, icon, action, className, children, ...props }: GlassCardProps) {
  return (
    <section
      className={cn(
        "relative rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {icon}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
