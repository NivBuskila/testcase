"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLiveStatus, reevaluate, runDebate } from "@/app/actions";
import { computeScores, computeStances } from "@/lib/scoring";
import type { AgentId, DebateMessage, DebateMode, DebateResult, LiveStatus, Synthesis } from "@/lib/types";

export type DebateStatus = "idle" | "assembling" | "debating" | "reevaluating" | "complete";

/** Simulated "typing" time per message, scaled by length. */
const typingDelay = (m: DebateMessage) => Math.min(2600, 700 + m.content.length * 7);

export function useDebate() {
  const [mode, setMode] = useState<DebateMode>("mock");
  const [live, setLive] = useState<LiveStatus>({ available: false, provider: null, model: null });
  const [status, setStatus] = useState<DebateStatus>("idle");
  const [dilemma, setDilemma] = useState("");
  const [result, setResult] = useState<DebateResult | null>(null);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [constraints, setConstraints] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const runId = useRef(0);

  useEffect(() => {
    getLiveStatus().then(setLive).catch(() => undefined);
  }, []);

  // Reveal queued messages one by one, with a typing indicator in between.
  const pending = revealed < messages.length;
  useEffect(() => {
    if (!pending) {
      if (status === "debating") setStatus("complete");
      return;
    }
    const timer = setTimeout(() => setRevealed((r) => r + 1), typingDelay(messages[revealed]));
    return () => clearTimeout(timer);
  }, [pending, revealed, messages, status]);

  const start = useCallback(
    async (text: string) => {
      const id = ++runId.current;
      setDilemma(text.trim());
      setStatus("assembling");
      setError(null);
      setResult(null);
      setMessages([]);
      setRevealed(0);
      setSynthesis(null);
      setConstraints([]);
      const res = await runDebate(text, mode);
      if (id !== runId.current) return;
      if (!res.ok) {
        setError(res.error);
        setStatus("idle");
        return;
      }
      setResult(res.data);
      setMessages(res.data.messages);
      setSynthesis(res.data.synthesis);
      setStatus("debating");
    },
    [mode],
  );

  const injectConstraint = useCallback(
    async (text: string) => {
      if (!result || !synthesis) return;
      const id = runId.current;
      setStatus("reevaluating");
      setError(null);
      const res = await reevaluate({
        dilemma: result.dilemma,
        constraint: text,
        mode,
        baseScores: result.baseScores,
        history: messages,
        previousConstraints: constraints,
        previousSteps: synthesis.steps,
      });
      if (id !== runId.current) return;
      if (!res.ok) {
        setError(res.error);
        setStatus(revealed < messages.length ? "debating" : "complete");
        return;
      }
      setConstraints((c) => [...c, res.data.constraint]);
      setMessages((m) => [...m, ...res.data.messages]);
      setSynthesis(res.data.synthesis);
      setStatus("debating");
    },
    [result, synthesis, mode, messages, constraints, revealed],
  );

  const skip = useCallback(() => setRevealed(messages.length), [messages.length]);

  const reset = useCallback(() => {
    runId.current++;
    setStatus("idle");
    setDilemma("");
    setResult(null);
    setMessages([]);
    setRevealed(0);
    setSynthesis(null);
    setConstraints([]);
    setError(null);
  }, []);

  const visible = useMemo(() => messages.slice(0, revealed), [messages, revealed]);
  const scores = useMemo(() => (result ? computeScores(result.baseScores, visible) : null), [result, visible]);
  const stances = useMemo(() => computeStances(visible), [visible]);
  const typingAgent: AgentId | null = pending ? messages[revealed].agentId : null;

  return {
    mode,
    setMode,
    live,
    status,
    dilemma,
    result,
    visible,
    totalMessages: messages.length,
    typingAgent,
    scores,
    stances,
    synthesis,
    synthesisReady: status === "complete",
    constraints,
    error,
    dismissError: () => setError(null),
    start,
    injectConstraint,
    skip,
    reset,
  };
}

export type DebateController = ReturnType<typeof useDebate>;
