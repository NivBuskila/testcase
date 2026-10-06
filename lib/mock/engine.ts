import { RADAR_AXES } from "../agents";
import { clamp, computeScores, riskReward } from "../scoring";
import { computeConfidence, VERDICT_HEADLINES, verdictFromIndex } from "../synthesis";
import type {
  AgentId,
  DebateMessage,
  DebateResult,
  RadarScores,
  ReevaluationResult,
  Synthesis,
  TreeNode,
} from "../types";
import { pickConstraintKind } from "./constraints";
import { pickFlavor, type Flavor, type OutcomeSpec } from "./flavors";

/** Small deterministic hash so the same dilemma always produces the same simulation. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function jitterScores(base: RadarScores, seed: number): RadarScores {
  const result = { ...base };
  RADAR_AXES.forEach(({ key }, i) => {
    const offset = ((seed >>> (i * 3)) % 11) - 5; // -5..5
    result[key] = clamp(base[key] + offset, 5, 95);
  });
  return result;
}

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

function msg(agentId: AgentId, content: string, sentiment: number, impact: Partial<RadarScores>, replyTo?: AgentId): DebateMessage {
  return { id: uid("m"), agentId, content, sentiment, impact, replyTo };
}

function buildMessages(f: Flavor): DebateMessage[] {
  return [
    msg(
      "visionary",
      `Let's start with the upside. ${f.upside} — that's the prize here, and windows like this don't stay open forever. Most people overestimate the risk of acting and underestimate the cost of standing still. A year from now you'll either be telling the story of how you did it, or explaining why you didn't.`,
      0.8,
      { upside: 6, timing: 4 },
    ),
    msg(
      "risk",
      `Before we celebrate, let's price the downside. The single biggest failure point is ${f.killRisk}. ${f.stake} Realistically you need ${f.cost} as a buffer, and I want a hard stop-loss defined before anything is signed.`,
      -0.6,
      { financialSafety: -8, resilience: -3 },
      "visionary",
    ),
    msg(
      "pragmatist",
      `You're both right, which means the answer is about sequencing, not yes or no. I'd frame this as ${f.experiment}. Success criterion: ${f.milestone} within ${f.window}. If we hit it, we scale the commitment; if we don't, we've lost weeks, not years.`,
      0.25,
      { feasibility: 8, resilience: 5 },
    ),
    msg(
      "devil",
      `I'll challenge the premise. This whole plan quietly assumes ${f.hiddenAssumption}. Has that been tested, or does it just feel true? Also — ${f.bias}.`,
      -0.35,
      { personalFit: -5, upside: -3 },
    ),
    msg(
      "visionary",
      `Fair hit, Vex — but assumptions only get tested by moving. Atlas's ${f.window} plan is exactly that test. And the asymmetry still holds: the downside is capped and recoverable, the upside isn't.`,
      0.6,
      { upside: 3, timing: 3 },
      "devil",
    ),
    msg(
      "risk",
      `I can live with a staged approach under three conditions: ${f.cost} set aside and untouchable, a written kill-criterion, and ${f.reversibility}. With those in place my risk rating drops from high to moderate.`,
      0.1,
      { financialSafety: 10, resilience: 6 },
      "pragmatist",
    ),
    msg(
      "pragmatist",
      `Then let's make it concrete. First: define the success metric and the kill-criterion in writing. Next: run the experiment on a fixed time budget, reviewing weekly. Finally: a formal go/no-go review at ${f.window} — decided by real data instead of adrenaline.`,
      0.35,
      { feasibility: 6, timing: 2 },
    ),
    msg(
      "devil",
      `I'm not fully convinced, but I'll accept a test with a deadline. Last warning: decide now who gets to call it a failure. If it's only you, you'll keep moving the goalposts. Bring in one honest outsider.`,
      0.05,
      { resilience: 4, personalFit: 3 },
      "pragmatist",
    ),
  ];
}

function outcomeNode(o: OutcomeSpec, prefix: string, i: number): TreeNode {
  return {
    id: `${prefix}-o${i}`,
    label: o.label,
    kind: "outcome",
    probability: o.probability,
    pros: o.pros,
    cons: o.cons,
    mitigations: o.mitigations,
    children: [],
  };
}

function buildTree(dilemma: string, f: Flavor): TreeNode {
  return {
    id: "root",
    label: dilemma,
    kind: "root",
    pros: [f.upside],
    cons: [f.killRisk.charAt(0).toUpperCase() + f.killRisk.slice(1)],
    mitigations: [`Start with ${f.experiment.split(":")[0]}`],
    children: f.options.map((o, i) => ({
      id: `opt${i}`,
      label: o.label,
      kind: "option",
      probability: o.probability,
      pros: o.pros,
      cons: o.cons,
      mitigations: o.mitigations,
      children: o.outcomes.map((out, j) => outcomeNode(out, `opt${i}`, j)),
    })),
  };
}

function buildSynthesis(
  dilemma: string,
  f: Flavor,
  scores: RadarScores,
  messages: DebateMessage[],
  constraints: string[],
  extraSteps: Synthesis["steps"] = [],
): Synthesis {
  const { index } = riskReward(scores);
  const verdict = verdictFromIndex(index);
  const confidence = computeConfidence(scores, messages);
  const constraintNote = constraints.length
    ? ` The plan was re-evaluated under ${constraints.length} injected constraint${constraints.length > 1 ? "s" : ""}, which shifted the risk profile.`
    : "";
  return {
    verdict,
    confidence,
    headline: VERDICT_HEADLINES[verdict],
    summary: `Four agents debated "${dilemma}". The strongest case for: ${f.upside.toLowerCase()}. The strongest case against: ${f.killRisk}. The panel converged on ${f.experiment}, with ${f.milestone} as the decisive signal.${constraintNote}`,
    steps: [...extraSteps, ...f.steps],
    keyRisks: f.keyRisks,
    constraintsApplied: constraints,
  };
}

export function mockDebate(dilemma: string): DebateResult {
  const flavor = pickFlavor(dilemma);
  const baseScores = jitterScores(flavor.base, hash(dilemma));
  const messages = buildMessages(flavor);
  const finalScores = computeScores(baseScores, messages);
  return {
    dilemma,
    baseScores,
    messages,
    tree: buildTree(dilemma, flavor),
    synthesis: buildSynthesis(dilemma, flavor, finalScores, messages, []),
  };
}

export function mockReevaluate(
  dilemma: string,
  constraint: string,
  baseScores: RadarScores,
  history: DebateMessage[],
  previousConstraints: string[],
  previousSteps: Synthesis["steps"],
): ReevaluationResult {
  const flavor = pickFlavor(dilemma);
  const kind = pickConstraintKind(constraint);
  const order: AgentId[] = ["risk", "visionary", "pragmatist", "devil"];
  const messages = order.map((id) => {
    const line = kind.lines[id];
    return { ...msg(id, line.text(constraint), line.sentiment, line.impact), constraint };
  });
  const all = [...history, ...messages];
  const scores = computeScores(baseScores, all);
  const constraints = [...previousConstraints, constraint];
  // Keep constraint-specific steps from earlier re-evaluations, newest first.
  const flavorTitles = new Set(flavor.steps.map((s) => s.title));
  const priorAdaptations = previousSteps.filter((s) => !flavorTitles.has(s.title));
  const step = { title: `Re-plan for: ${constraint}`, detail: kind.adaptation, timeframe: "Immediately" };
  return {
    constraint,
    messages,
    synthesis: buildSynthesis(dilemma, flavor, scores, all, constraints, [step, ...priorAdaptations]),
  };
}
