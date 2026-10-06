import { isAgentId, RADAR_AXES } from "../agents";
import { clamp } from "../scoring";
import type { DebateMessage, RadarScores, Synthesis, TreeNode, Verdict } from "../types";

type Obj = Record<string, unknown>;

const asObj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asStr = (v: unknown, fallback = ""): string => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const asNum = (v: unknown, fallback: number): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const strList = (v: unknown, max = 5): string[] => asArr(v).map((s) => asStr(s)).filter(Boolean).slice(0, max);

const VERDICTS: Verdict[] = ["GO", "GO WITH CONDITIONS", "WAIT", "NO-GO"];
let counter = 0;

export function normalizeScores(v: unknown): RadarScores {
  const o = asObj(v);
  return Object.fromEntries(RADAR_AXES.map(({ key }) => [key, clamp(Math.round(asNum(o[key], 50)), 0, 100)])) as RadarScores;
}

export function normalizeMessages(v: unknown, constraint?: string): DebateMessage[] {
  return asArr(v)
    .map(asObj)
    .filter((m) => isAgentId(m.agentId) && asStr(m.content))
    .map((m) => {
      const impactSrc = asObj(m.impact);
      const impact: Partial<RadarScores> = {};
      for (const { key } of RADAR_AXES) {
        if (typeof impactSrc[key] === "number") impact[key] = clamp(Math.round(impactSrc[key] as number), -15, 15);
      }
      return {
        id: `live-${Date.now().toString(36)}-${(counter++).toString(36)}`,
        agentId: m.agentId as DebateMessage["agentId"],
        content: asStr(m.content),
        sentiment: clamp(asNum(m.sentiment, 0), -1, 1),
        impact,
        replyTo: isAgentId(m.replyTo) ? m.replyTo : undefined,
        constraint,
      };
    });
}

function normalizeNode(v: unknown, id: string, kind: TreeNode["kind"], childKey?: string): TreeNode {
  const o = asObj(v);
  const childKind: TreeNode["kind"] = kind === "root" ? "option" : "outcome";
  return {
    id,
    label: asStr(o.label, "Untitled"),
    kind,
    probability: kind === "root" ? undefined : clamp(Math.round(asNum(o.probability, 50)), 0, 100),
    pros: strList(o.pros),
    cons: strList(o.cons),
    mitigations: strList(o.mitigations),
    children: childKey
      ? asArr(o[childKey])
          .slice(0, 4)
          .map((c, i) => normalizeNode(c, `${id === "root" ? "opt" : `${id}-o`}${i}`, childKind, kind === "root" ? "outcomes" : undefined))
      : [],
  };
}

export function normalizeTree(v: unknown, dilemma: string): TreeNode {
  const tree = normalizeNode(v, "root", "root", "options");
  tree.label = dilemma;
  if (!tree.children.length) throw new Error("The AI response did not include decision paths.");
  return tree;
}

export function normalizeSynthesis(v: unknown, constraintsApplied: string[]): Synthesis {
  const o = asObj(v);
  const verdict = VERDICTS.includes(o.verdict as Verdict) ? (o.verdict as Verdict) : "WAIT";
  return {
    verdict,
    confidence: clamp(Math.round(asNum(o.confidence, 60)), 0, 100),
    headline: asStr(o.headline, "The panel reached a provisional consensus."),
    summary: asStr(o.summary),
    steps: asArr(o.steps)
      .map(asObj)
      .map((s) => ({ title: asStr(s.title), detail: asStr(s.detail), timeframe: asStr(s.timeframe, "Next") }))
      .filter((s) => s.title)
      .slice(0, 6),
    keyRisks: strList(o.keyRisks, 4),
    constraintsApplied,
  };
}
