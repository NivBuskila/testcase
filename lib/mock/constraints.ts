import type { AgentId, RadarScores } from "../types";

interface ConstraintLine {
  sentiment: number;
  impact: Partial<RadarScores>;
  text: (c: string) => string;
}

interface ConstraintKind {
  key: string;
  matcher: RegExp;
  adaptation: string;
  lines: Record<AgentId, ConstraintLine>;
}

const KINDS: ConstraintKind[] = [
  {
    key: "budget",
    matcher: /budget|money|cash|fund|cost|price|halv|half|cut|salary|savings|runway|\$|€|₪|£/i,
    adaptation: "Cut scope to the critical path, replace paid tools and hires with manual work, and extend the test window instead of skipping it.",
    lines: {
      visionary: {
        sentiment: 0.45,
        impact: { upside: -2, feasibility: -3 },
        text: (c) => `"${c}" hurts, but constraints breed creativity. Cut scope, not ambition — the leanest version of this plan can still prove the thesis.`,
      },
      risk: {
        sentiment: -0.7,
        impact: { financialSafety: -10 },
        text: (c) => `This changes my numbers materially. With "${c}", the buffer we agreed on no longer covers a bad quarter. I now require a smaller first commitment and a pre-agreed stop-loss.`,
      },
      pragmatist: {
        sentiment: 0.15,
        impact: { feasibility: -4, resilience: 3 },
        text: () => `Then we re-sequence: drop everything that isn't on the critical path, swap paid tools and hires for manual work, and extend the test window rather than skipping it.`,
      },
      devil: {
        sentiment: -0.2,
        impact: { upside: -2, personalFit: 2 },
        text: () => `Interesting how the plan suddenly gets "leaner" when money is tight. If it works on half the budget, why was the full budget ever needed? Either the original plan was padded, or the new one is fantasy.`,
      },
    },
  },
  {
    key: "time",
    matcher: /time|deadline|month|week|year|sooner|faster|urgent|clock|days?\b|quarter/i,
    adaptation: "Shrink scope to fit the clock: one milestone, one owner, one metric — everything else moves to phase two.",
    lines: {
      visionary: {
        sentiment: 0.6,
        impact: { timing: 5 },
        text: () => `Pressure is clarifying. A shorter clock forces us to focus on the one bet that matters — speed can be our advantage here.`,
      },
      risk: {
        sentiment: -0.5,
        impact: { resilience: -6, feasibility: -3 },
        text: (c) => `Compressed timelines are where most failures are born — skipped checks, rushed contracts, no time to absorb a surprise. With "${c}", I want an explicit list of what we are NOT doing.`,
      },
      pragmatist: {
        sentiment: 0.1,
        impact: { feasibility: -4 },
        text: () => `Then scope has to shrink to fit the clock. One milestone, one owner, one metric. Everything else goes into a later phase.`,
      },
      devil: {
        sentiment: -0.3,
        impact: { timing: -3 },
        text: () => `Who set this deadline, and is it real? Artificial urgency is the oldest trick for making a bad decision feel inevitable.`,
      },
    },
  },
  {
    key: "people",
    matcher: /team|co-?founder|hire|hiring|people|staff|alone|solo|employee|engineer|developer/i,
    adaptation: "Reduce the plan to what the current team can sustain, document every critical process, and assign a backup for each key role.",
    lines: {
      visionary: {
        sentiment: 0.4,
        impact: { upside: -2 },
        text: (c) => `"${c}" means we need leverage over headcount — automation, partners and outsourcing can cover far more than people expect.`,
      },
      risk: {
        sentiment: -0.55,
        impact: { resilience: -8 },
        text: () => `Key-person risk just went up sharply. If one person gets sick or leaves, the whole plan stalls. I want documented processes and a backup for every critical role.`,
      },
      pragmatist: {
        sentiment: 0.1,
        impact: { feasibility: -6 },
        text: () => `Capacity is the real constraint now. Let's cut the plan to what this team can deliver at a sustainable pace, and buy time with ruthless prioritization.`,
      },
      devil: {
        sentiment: -0.25,
        impact: { personalFit: -3 },
        text: () => `Maybe this is the real signal. If you can't get the right people around this idea, ask why — that's often market feedback in disguise.`,
      },
    },
  },
  {
    key: "market",
    matcher: /compet|market|recession|economy|demand|customer|rival|downturn|inflation|war|crisis/i,
    adaptation: "Stress-test the plan at 50% of expected demand and narrow the focus to the segment least affected.",
    lines: {
      visionary: {
        sentiment: 0.5,
        impact: { timing: 3, upside: 2 },
        text: () => `Market turbulence is when category leaders are made. While others freeze, a focused player can win share cheaply.`,
      },
      risk: {
        sentiment: -0.65,
        impact: { financialSafety: -6, upside: -4 },
        text: (c) => `Every demand assumption made before "${c}" is now stale. I'd stress-test revenue at 50% of plan and see whether the decision still holds.`,
      },
      pragmatist: {
        sentiment: 0.05,
        impact: { feasibility: -2 },
        text: () => `Let's re-run the numbers with conservative assumptions and focus on the segment least affected. Same strategy, narrower target.`,
      },
      devil: {
        sentiment: -0.35,
        impact: { timing: -5 },
        text: () => `Everyone loves to say "downturns create opportunity" — but that's survivorship bias. Most players in a contracting market simply shrink. Prove you're the exception.`,
      },
    },
  },
  {
    key: "personal",
    matcher: /family|kid|child|baby|health|wife|husband|spouse|mortgage|relocat|legal|law|regulat|contract|non-?compete|compliance|visa|tax|pregnan|parent/i,
    adaptation: "Map the fixed obligations first, build the plan around them, and fit the opportunity into the remaining capacity.",
    lines: {
      visionary: {
        sentiment: 0.3,
        impact: { personalFit: -3 },
        text: (c) => `This matters more than any metric. A plan that breaks your life isn't a win — but it can be redesigned to fit around "${c}".`,
      },
      risk: {
        sentiment: -0.6,
        impact: { financialSafety: -5, resilience: -5 },
        text: () => `Personal and legal obligations are non-negotiable downside. I want them mapped explicitly — obligations, timelines, and what happens in the worst case.`,
      },
      pragmatist: {
        sentiment: 0.15,
        impact: { feasibility: -3, resilience: 2 },
        text: () => `Let's build the plan around the fixed commitments first, then fit the opportunity into the remaining capacity. Slower, but sustainable.`,
      },
      devil: {
        sentiment: -0.15,
        impact: { personalFit: -4 },
        text: (c) => `Be honest about whether "${c}" is a constraint — or the real answer you've been avoiding. Sometimes the obstacle is telling you something.`,
      },
    },
  },
];

const GENERIC: ConstraintKind = {
  key: "generic",
  matcher: /.*/,
  adaptation: "Identify the milestone this constraint affects, adjust only that one, and add an extra checkpoint before the next commitment.",
  lines: {
    visionary: {
      sentiment: 0.45,
      impact: { upside: -1 },
      text: (c) => `"${c}" adds friction, not a dead end. The core opportunity is intact — we adapt the route, not the destination.`,
    },
    risk: {
      sentiment: -0.5,
      impact: { financialSafety: -4, resilience: -4 },
      text: (c) => `Every new constraint compounds the others. With "${c}" in play, I'd lower our commitment level one notch and add a checkpoint.`,
    },
    pragmatist: {
      sentiment: 0.1,
      impact: { feasibility: -3 },
      text: () => `Let's absorb it into the plan: identify which milestone it affects, adjust that one, and keep the rest of the sequence intact.`,
    },
    devil: {
      sentiment: -0.3,
      impact: { upside: -2 },
      text: (c) => `Notice how quickly we're all rationalizing. If "${c}" had been known on day one, would we have chosen this path at all?`,
    },
  },
};

export function pickConstraintKind(constraint: string): ConstraintKind {
  return KINDS.find((k) => k.matcher.test(constraint)) ?? GENERIC;
}
