import type { AgentId, RadarAxis } from "./types";

export interface AgentPersona {
  id: AgentId;
  name: string;
  title: string;
  emoji: string;
  focus: string;
  /** Prompt description used for live LLM mode. */
  brief: string;
  /** Hex accent used in charts / SVG. */
  hex: string;
  /** Tailwind class sets (kept static so Tailwind can detect them). */
  text: string;
  border: string;
  bg: string;
  ring: string;
  gradient: string;
}

export const AGENTS: Record<AgentId, AgentPersona> = {
  visionary: {
    id: "visionary",
    name: "Nova",
    title: "The Visionary",
    emoji: "🚀",
    focus: "Growth, upside & bold moves",
    brief:
      "An optimistic serial founder. Focuses on growth, asymmetric upside, momentum and the cost of NOT acting. Energetic, inspiring, but grounded in concrete opportunities.",
    hex: "#22d3ee",
    text: "text-cyan-300",
    border: "border-cyan-400/40",
    bg: "bg-cyan-400/10",
    ring: "ring-cyan-400/60",
    gradient: "from-cyan-400 to-sky-600",
  },
  risk: {
    id: "risk",
    name: "Aegis",
    title: "The Risk Manager",
    emoji: "🛡️",
    focus: "Failure points & worst cases",
    brief:
      "A former auditor and risk officer. Focuses on failure points, legal and financial exposure, worst-case scenarios and downside protection. Precise, cautious, quantifies risk.",
    hex: "#fbbf24",
    text: "text-amber-300",
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/60",
    gradient: "from-amber-300 to-orange-600",
  },
  pragmatist: {
    id: "pragmatist",
    name: "Atlas",
    title: "The Pragmatist",
    emoji: "🧠",
    focus: "Execution, timelines & ROI",
    brief:
      "A veteran operator. Focuses on execution, timelines, ROI, resource constraints and the smallest next step. Calm, structured, always proposes a concrete plan.",
    hex: "#34d399",
    text: "text-emerald-300",
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/10",
    ring: "ring-emerald-400/60",
    gradient: "from-emerald-300 to-teal-600",
  },
  devil: {
    id: "devil",
    name: "Vex",
    title: "The Devil's Advocate",
    emoji: "🎭",
    focus: "Hidden flaws & assumptions",
    brief:
      "A sharp, contrarian critic. Challenges assumptions, exposes hidden flaws, cognitive biases and blind spots in everyone else's arguments. Blunt but fair.",
    hex: "#f472b6",
    text: "text-pink-300",
    border: "border-pink-400/40",
    bg: "bg-pink-400/10",
    ring: "ring-pink-400/60",
    gradient: "from-pink-400 to-fuchsia-700",
  },
};

export const AGENT_ORDER: AgentId[] = ["visionary", "risk", "pragmatist", "devil"];

export const RADAR_AXES: { key: RadarAxis; label: string }[] = [
  { key: "upside", label: "Upside" },
  { key: "feasibility", label: "Feasibility" },
  { key: "financialSafety", label: "Financial Safety" },
  { key: "timing", label: "Timing" },
  { key: "personalFit", label: "Personal Fit" },
  { key: "resilience", label: "Resilience" },
];

export function isAgentId(value: unknown): value is AgentId {
  return typeof value === "string" && value in AGENTS;
}
