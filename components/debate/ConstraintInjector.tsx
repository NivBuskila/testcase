"use client";

import { useState, type FormEvent } from "react";
import { Zap } from "lucide-react";
import { Button } from "../ui/Button";

const PRESETS = [
  "What if our budget is halved?",
  "What if we must decide in 30 days?",
  "What if a major competitor enters?",
  "What if you have to do it solo?",
];

interface ConstraintInjectorProps {
  disabled: boolean;
  used: string[];
  onInject: (constraint: string) => void;
}

export function ConstraintInjector({ disabled, used, onInject }: ConstraintInjectorProps) {
  const [value, setValue] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onInject(text);
    setValue("");
  };

  return (
    <div className="space-y-2.5 border-t border-white/10 pt-3">
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor="constraint" className="sr-only">
          Inject a constraint
        </label>
        <input
          id="constraint"
          dir="auto"
          value={value}
          maxLength={400}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Inject a constraint… e.g. “What if the budget is halved?”"
          className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        />
        <Button type="submit" variant="amber" disabled={disabled || !value.trim()}>
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Inject</span>
        </Button>
      </form>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.filter((p) => !used.includes(p)).map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => onInject(p)}
            className="rounded-full border border-amber-400/20 bg-amber-400/5 px-2.5 py-1 text-[11px] text-amber-200/90 transition hover:border-amber-400/50 hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
