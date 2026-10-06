"use server";

import { completeJSON, liveStatus } from "@/lib/llm/provider";
import { normalizeMessages, normalizeScores, normalizeSynthesis, normalizeTree } from "@/lib/llm/normalize";
import { debatePrompt, reevaluatePrompt, SYSTEM_PROMPT } from "@/lib/llm/prompts";
import { mockDebate, mockReevaluate } from "@/lib/mock/engine";
import type { ActionResult, DebateMessage, DebateMode, DebateResult, LiveStatus, RadarScores, ReevaluationResult, Synthesis } from "@/lib/types";

const MAX_INPUT = 400;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cleanInput(text: string, label: string) {
  const value = (text ?? "").trim();
  if (!value) throw new Error(`Please enter a ${label}.`);
  if (value.length > MAX_INPUT) throw new Error(`The ${label} must be ${MAX_INPUT} characters or fewer.`);
  return value;
}

const fail = (e: unknown): { ok: false; error: string } => ({
  ok: false,
  error: e instanceof Error ? e.message : "Something went wrong.",
});

export async function getLiveStatus(): Promise<LiveStatus> {
  return liveStatus();
}

export async function runDebate(rawDilemma: string, mode: DebateMode): Promise<ActionResult<DebateResult>> {
  try {
    const dilemma = cleanInput(rawDilemma, "dilemma");
    if (mode === "mock") {
      await wait(1400); // Let the "assembling agents" skeleton breathe.
      return { ok: true, data: mockDebate(dilemma) };
    }
    const raw = (await completeJSON(SYSTEM_PROMPT, debatePrompt(dilemma))) as Record<string, unknown>;
    const messages = normalizeMessages(raw.messages);
    if (messages.length < 4) throw new Error("The AI returned too few debate messages. Please try again.");
    return {
      ok: true,
      data: {
        dilemma,
        baseScores: normalizeScores(raw.baseScores),
        messages,
        tree: normalizeTree(raw.tree, dilemma),
        synthesis: normalizeSynthesis(raw.synthesis, []),
      },
    };
  } catch (e) {
    return fail(e);
  }
}

export interface ReevaluateInput {
  dilemma: string;
  constraint: string;
  mode: DebateMode;
  baseScores: RadarScores;
  history: DebateMessage[];
  previousConstraints: string[];
  previousSteps: Synthesis["steps"];
}

export async function reevaluate(input: ReevaluateInput): Promise<ActionResult<ReevaluationResult>> {
  try {
    const dilemma = cleanInput(input.dilemma, "dilemma");
    const constraint = cleanInput(input.constraint, "constraint");
    if (input.mode === "mock") {
      await wait(900);
      return {
        ok: true,
        data: mockReevaluate(dilemma, constraint, input.baseScores, input.history, input.previousConstraints, input.previousSteps),
      };
    }
    const raw = (await completeJSON(
      SYSTEM_PROMPT,
      reevaluatePrompt(dilemma, constraint, input.history, input.previousConstraints),
    )) as Record<string, unknown>;
    const messages = normalizeMessages(raw.messages, constraint);
    if (!messages.length) throw new Error("The AI returned no reactions. Please try again.");
    return {
      ok: true,
      data: { constraint, messages, synthesis: normalizeSynthesis(raw.synthesis, [...input.previousConstraints, constraint]) },
    };
  } catch (e) {
    return fail(e);
  }
}
