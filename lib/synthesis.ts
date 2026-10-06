import { AGENT_ORDER } from "./agents";
import { clamp, computeStances, riskReward } from "./scoring";
import type { DebateMessage, RadarScores, Verdict } from "./types";

export function verdictFromIndex(index: number): Verdict {
  if (index >= 66) return "GO";
  if (index >= 50) return "GO WITH CONDITIONS";
  if (index >= 38) return "WAIT";
  return "NO-GO";
}

export const VERDICT_HEADLINES: Record<Verdict, string> = {
  GO: "The panel backs the move — proceed with discipline.",
  "GO WITH CONDITIONS": "Proceed — but only through a staged, time-boxed test.",
  WAIT: "Not yet — gather hard evidence before committing.",
  "NO-GO": "The downside currently outweighs the upside.",
};

/** Confidence rises with agreement between agents and with distance from a coin-flip index. */
export function computeConfidence(scores: RadarScores, messages: DebateMessage[]) {
  const stances = computeStances(messages);
  const values = AGENT_ORDER.map((id) => stances[id]);
  const spread = Math.max(...values) - Math.min(...values);
  const agreement = 1 - spread / 200;
  const { index } = riskReward(scores);
  return clamp(Math.round(48 + agreement * 32 + Math.abs(index - 50) * 0.7), 30, 96);
}
