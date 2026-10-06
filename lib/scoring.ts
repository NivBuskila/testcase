import { AGENT_ORDER, RADAR_AXES } from "./agents";
import type { AgentId, DebateMessage, RadarScores } from "./types";

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Apply cumulative message impacts on top of the base radar scores. */
export function computeScores(base: RadarScores, messages: DebateMessage[]): RadarScores {
  const result = { ...base };
  for (const m of messages) {
    for (const { key } of RADAR_AXES) {
      const delta = m.impact[key];
      if (typeof delta === "number") result[key] = clamp(result[key] + delta, 0, 100);
    }
  }
  return result;
}

/** Reward = upside + timing + personal fit; Risk = inverse of safety, feasibility, resilience. */
export function riskReward(scores: RadarScores) {
  const reward = Math.round((scores.upside + scores.timing + scores.personalFit) / 3);
  const risk = Math.round(100 - (scores.financialSafety + scores.feasibility + scores.resilience) / 3);
  const index = clamp(Math.round(50 + (reward - risk) / 2), 0, 100);
  return { reward, risk, index };
}

/** Per-agent stance (-100..100) as an exponentially weighted average of their sentiment. */
export function computeStances(messages: DebateMessage[]): Record<AgentId, number> {
  const stances = Object.fromEntries(AGENT_ORDER.map((id) => [id, 0])) as Record<AgentId, number>;
  const seen = Object.fromEntries(AGENT_ORDER.map((id) => [id, false])) as Record<AgentId, boolean>;
  for (const m of messages) {
    const value = clamp(m.sentiment, -1, 1) * 100;
    stances[m.agentId] = seen[m.agentId] ? stances[m.agentId] * 0.4 + value * 0.6 : value;
    seen[m.agentId] = true;
  }
  for (const id of AGENT_ORDER) stances[id] = Math.round(stances[id]);
  return stances;
}

export function stanceLabel(stance: number) {
  if (stance >= 45) return "Strongly for";
  if (stance >= 12) return "Leaning for";
  if (stance > -12) return "Undecided";
  if (stance > -45) return "Leaning against";
  return "Strongly against";
}
