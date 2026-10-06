export type AgentId = "visionary" | "risk" | "pragmatist" | "devil";

export type RadarAxis =
  | "upside"
  | "feasibility"
  | "financialSafety"
  | "timing"
  | "personalFit"
  | "resilience";

export type RadarScores = Record<RadarAxis, number>;

export interface DebateMessage {
  id: string;
  agentId: AgentId;
  content: string;
  /** -1 (strongly against) .. 1 (strongly in favour) */
  sentiment: number;
  /** Score nudges applied to the radar once this message is spoken. */
  impact: Partial<RadarScores>;
  /** Optional agent this message responds to. */
  replyTo?: AgentId;
  /** Set when the message is part of a constraint re-evaluation. */
  constraint?: string;
}

export type TreeNodeKind = "root" | "option" | "outcome";

export interface TreeNode {
  id: string;
  label: string;
  kind: TreeNodeKind;
  /** 0..100 likelihood (outcomes) or attractiveness (options). */
  probability?: number;
  pros: string[];
  cons: string[];
  mitigations: string[];
  children: TreeNode[];
}

export type Verdict = "GO" | "GO WITH CONDITIONS" | "WAIT" | "NO-GO";

export interface SynthesisStep {
  title: string;
  detail: string;
  timeframe: string;
}

export interface Synthesis {
  verdict: Verdict;
  /** 0..100 */
  confidence: number;
  headline: string;
  summary: string;
  steps: SynthesisStep[];
  keyRisks: string[];
  constraintsApplied: string[];
}

export interface DebateResult {
  dilemma: string;
  baseScores: RadarScores;
  messages: DebateMessage[];
  tree: TreeNode;
  synthesis: Synthesis;
}

export interface ReevaluationResult {
  constraint: string;
  messages: DebateMessage[];
  synthesis: Synthesis;
}

export type DebateMode = "mock" | "live";

export interface LiveStatus {
  available: boolean;
  provider: "openai" | "anthropic" | null;
  model: string | null;
}

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
