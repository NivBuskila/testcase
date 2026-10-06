import { AGENTS, AGENT_ORDER } from "../agents";
import type { DebateMessage } from "../types";

const personas = AGENT_ORDER.map((id) => `- "${id}" = ${AGENTS[id].emoji} ${AGENTS[id].name}, ${AGENTS[id].title}: ${AGENTS[id].brief}`).join("\n");

const AXES =
  'Radar axes (0-100, higher is better for the decision-maker): "upside", "feasibility", "financialSafety", "timing", "personalFit", "resilience".';

const MESSAGE_SHAPE = `{ "agentId": one of "visionary"|"risk"|"pragmatist"|"devil", "content": string (2-4 sentences, in character, referencing others by name when replying), "sentiment": number -1..1 (stance on going ahead), "impact": object of radar axis -> integer -12..12 (how this argument shifts the scores), "replyTo": optional agentId }`;

const SYNTHESIS_SHAPE = `{ "verdict": "GO"|"GO WITH CONDITIONS"|"WAIT"|"NO-GO", "confidence": integer 0-100, "headline": one sentence, "summary": 3-4 sentences, "steps": [4-5 x { "title": string, "detail": one sentence, "timeframe": short string }], "keyRisks": [3 short strings] }`;

export const SYSTEM_PROMPT = `You are DecisionForge, a multi-agent decision simulator. You simulate a lively, realistic panel debate between four AI personas with contrasting viewpoints:
${personas}

Rules:
- Agents must genuinely disagree at first and then converge toward a practical consensus.
- Be specific to the user's dilemma: concrete numbers, timelines, risks and experiments. No generic platitudes.
- Reply in the same language as the user's dilemma.
- ${AXES}
- Respond with a single valid JSON object only. No markdown.`;

export function debatePrompt(dilemma: string) {
  return `Dilemma: "${dilemma}"

Return JSON with this exact shape:
{
  "baseScores": { "upside": int, "feasibility": int, "financialSafety": int, "timing": int, "personalFit": int, "resilience": int },
  "messages": [8 messages, alternating agents so every agent speaks twice, each ${MESSAGE_SHAPE}],
  "tree": { "label": short restatement of the dilemma, "pros": [1-2], "cons": [1-2], "mitigations": [1-2],
            "options": [3 x { "label": 2-5 words, "probability": int 0-100 attractiveness, "pros": [2], "cons": [2], "mitigations": [2],
                              "outcomes": [2 x { "label": 2-6 words, "probability": int 0-100 likelihood, "pros": [1-2], "cons": [1-2], "mitigations": [1-2] }] }] },
  "synthesis": ${SYNTHESIS_SHAPE}
}`;
}

export function reevaluatePrompt(dilemma: string, constraint: string, history: DebateMessage[], previousConstraints: string[]) {
  const transcript = history.map((m) => `${AGENTS[m.agentId].name} (${m.agentId}): ${m.content}`).join("\n");
  const prior = previousConstraints.length ? `Previously injected constraints: ${previousConstraints.map((c) => `"${c}"`).join(", ")}.` : "";
  return `Dilemma: "${dilemma}"
${prior}
Debate so far:
${transcript}

A NEW CONSTRAINT has just been injected mid-debate: "${constraint}".
Each of the four agents reacts to it and re-evaluates their position.

Return JSON with this exact shape:
{
  "messages": [4 messages, one per agent, each ${MESSAGE_SHAPE}],
  "synthesis": ${SYNTHESIS_SHAPE} (updated to account for ALL constraints; the first step must address the new constraint)
}`;
}
