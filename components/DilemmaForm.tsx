"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AGENTS, AGENT_ORDER } from "@/lib/agents";
import { Button } from "./ui/Button";
import { AgentIcon } from "./agents/AgentIcon";

const EXAMPLES = [
  "Should I quit my job to launch a SaaS?",
  "Should we pivot our startup to B2B?",
  "Should I migrate our monolith to microservices?",
  "Should I move abroad for a new opportunity?",
];

interface DilemmaFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (text: string) => void;
}

export function DilemmaForm({ loading, error, onSubmit }: DilemmaFormProps) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value);
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Multi-Agent Decision Sandbox</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">What's your dilemma?</h2>
          <p className="mt-3 text-sm text-slate-400">
            Four AI personas with opposing viewpoints will debate it live and build you a data-backed decision report.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8">
          <div className="relative">
            <textarea
              dir="auto"
              value={value}
              maxLength={400}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Should I quit my job to launch a SaaS?"
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 p-4 pb-20 text-base text-slate-100 placeholder:text-slate-500 shadow-xl backdrop-blur-xl focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
            <Button
              type="submit"
              disabled={loading || !value.trim()}
              size="lg"
              className="absolute bottom-3 right-3 bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold hover:from-cyan-300 hover:to-sky-400 hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] disabled:from-cyan-400/70 disabled:to-sky-500/70 disabled:opacity-100 disabled:shadow-none"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Assembling…" : "Convene the panel"}
            </Button>
          </div>
          <p className="mt-1.5 text-right text-[11px] text-slate-500">{value.length}/400</p>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AGENT_ORDER.map((id) => {
            const agent = AGENTS[id];
            return (
              <div key={id} className={`rounded-xl border ${agent.border} ${agent.bg} p-3 text-center`}>
                <AgentIcon agentId={id} className={`mx-auto h-6 w-6 ${agent.text}`} />
                <p className="mt-1 text-xs font-semibold text-white">{agent.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{agent.focus}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
