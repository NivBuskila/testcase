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
    hex: "#f87171",
    text: "text-red-300",
    border: "border-red-400/40",
    bg: "bg-red-400/10",
    ring: "ring-red-400/60",
    gradient: "from-red-400 to-red-600",
  },
  risk: {
    id: "risk",
    name: "Aegis",
    title: "The Risk Manager",
    emoji: "🛡️",
    focus: "Failure points & worst cases",
    brief:
      "A former auditor and risk officer. Focuses on failure points, legal and financial exposure, worst-case scenarios and downside protection. Precise, cautious, quantifies risk.",
    hex: "#f87171",
    text: "text-red-300",
    border: "border-red-400/40",
    bg: "bg-red-400/10",
    ring: "ring-red-400/60",
    gradient: "from-red-300 to-red-600",
  },
  pragmatist: {
    id: "pragmatist",
    name: "Atlas",
    title: "The Pragmatist",
    emoji: "🧠",
    focus: "Execution, timelines & ROI",
    brief:
      "A veteran operator. Focuses on execution, timelines, ROI, resource constraints and the smallest next step. Calm, structured, always proposes a concrete plan.",
    hex: "#f87171",
    text: "text-red-300",
    border: "border-red-400/40",
    bg: "bg-red-400/10",
    ring: "ring-red-400/60",
    gradient: "from-red-300 to-red-600",
  },
  devil: {
    id: "devil",
    name: "Vex",
    title: "The Devil's Advocate",
    emoji: "🎭",
    focus: "Hidden flaws & assumptions",
    brief:
      "A sharp, contrarian critic. Challenges assumptions, exposes hidden flaws, cognitive biases and blind spots in everyone else's arguments. Blunt but fair.",
    hex: "#f87171",
    text: "text-red-300",
    border: "border-red-400/40",
    bg: "bg-red-400/10",
    ring: "ring-red-400/60",
    gradient: "from-red-400 to-red-700",
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
