import type { RadarScores, SynthesisStep } from "../types";

export interface OutcomeSpec {
  label: string;
  probability: number;
  pros: string[];
  cons: string[];
  mitigations: string[];
}

export interface OptionSpec extends OutcomeSpec {
  outcomes: OutcomeSpec[];
}

export interface Flavor {
  key: "career" | "startup" | "tech" | "general";
  matcher: RegExp;
  base: RadarScores;
  upside: string;
  killRisk: string;
  cost: string;
  stake: string;
  experiment: string;
  milestone: string;
  window: string;
  reversibility: string;
  hiddenAssumption: string;
  bias: string;
  options: OptionSpec[];
  steps: SynthesisStep[];
  keyRisks: string[];
}

const career: Flavor = {
  key: "career",
  matcher: /\b(job|quit|career|salary|promotion|offer|boss|manager|resign|employer|freelanc|role|position)\b/i,
  base: { upside: 66, feasibility: 52, financialSafety: 40, timing: 58, personalFit: 64, resilience: 48 },
  upside: "Ownership of your time, your skills and your career trajectory",
  killRisk: "income stopping before the new path produces any — the classic runway cliff",
  cost: "6–9 months of living expenses",
  stake: "You're trading a predictable salary, benefits and seniority for uncertainty.",
  experiment:
    "a 90-day parallel track: keep the paycheck, build the new path on fixed evenings, and negotiate a reduced schedule if you can",
  milestone: "one hard signal of demand — a paying client, a real offer or a signed commitment",
  window: "90 days",
  reversibility: "a realistic way back — keep your network warm, re-entering this market within 3–6 months is plausible",
  hiddenAssumption:
    "that the problem is the job and not the work itself — plenty of people quit a role only to recreate it somewhere else",
  bias: "be honest about how much of this is escaping a bad situation versus being pulled toward something better",
  options: [
    {
      label: "Leap now",
      probability: 34,
      pros: ["Maximum focus and speed", "Clear identity and story"],
      cons: ["Income stops immediately", "Financial pressure distorts decisions"],
      mitigations: ["Secure 9 months of runway first", "Line up 1–2 freelance clients as a floor"],
      outcomes: [
        {
          label: "Traction within 6 months",
          probability: 40,
          pros: ["Validated path with compounding momentum"],
          cons: ["Burnout risk from the intensity"],
          mitigations: ["Set weekly recovery rituals and a hard stop day"],
        },
        {
          label: "Runway runs out, back to employment",
          probability: 60,
          pros: ["New skills and a stronger story for employers"],
          cons: ["Savings depleted", "Confidence hit"],
          mitigations: ["Pre-agree a kill date so you exit with savings left"],
        },
      ],
    },
    {
      label: "Parallel 90-day test",
      probability: 54,
      pros: ["Keeps income and benefits", "Decision made on real data"],
      cons: ["Slower progress", "Energy split across two fronts"],
      mitigations: ["Protect 12 fixed hours a week", "Negotiate a 4-day week"],
      outcomes: [
        {
          label: "Signal found → planned exit",
          probability: 55,
          pros: ["You leave with traction and savings intact"],
          cons: ["Transition may still feel abrupt"],
          mitigations: ["Give generous notice and keep the relationship warm"],
        },
        {
          label: "No signal → stay and refine",
          probability: 45,
          pros: ["Cheap lesson, zero damage"],
          cons: ["Frustration from a 'failed' test"],
          mitigations: ["Treat it as data: change one variable and retest"],
        },
      ],
    },
    {
      label: "Stay & renegotiate",
      probability: 30,
      pros: ["Zero financial risk", "Leverage for a raise, new role or remote work"],
      cons: ["The itch may not go away", "Opportunity cost compounds"],
      mitigations: ["Set a 6-month review date with yourself"],
      outcomes: [
        {
          label: "Role improves materially",
          probability: 40,
          pros: ["Better conditions without the risk"],
          cons: ["Ambition parked, not resolved"],
          mitigations: ["Keep a small side project alive"],
        },
        {
          label: "Regret resurfaces in 12 months",
          probability: 60,
          pros: ["You'll know it's real"],
          cons: ["A year of opportunity lost"],
          mitigations: ["Decide now what would trigger the leap later"],
        },
      ],
    },
  ],
  steps: [
    { title: "Define your exit number", detail: "Calculate monthly burn and the exact runway you need before resigning.", timeframe: "Week 1" },
    { title: "Run the parallel test", detail: "Validate demand for 90 days while employed, against a written success metric.", timeframe: "Weeks 2–13" },
    { title: "Build a safety net", detail: "Warm up three people who could hire you back or send you freelance work.", timeframe: "Ongoing" },
    { title: "Formal go/no-go review", detail: "Review the data with one honest outsider and decide — no moving goalposts.", timeframe: "Day 90" },
  ],
  keyRisks: [
    "Runway cliff before the new path pays",
    "Escaping a symptom rather than its cause",
    "Loss of benefits, seniority and vesting equity",
  ],
};

const startup: Flavor = {
  key: "startup",
  matcher:
    /\b(startup|start-up|saas|launch|pivot|b2b|b2c|product|funding|investor|raise|customers?|revenue|founder|business|company|market|pricing)\b/i,
  base: { upside: 72, feasibility: 50, financialSafety: 42, timing: 60, personalFit: 58, resilience: 46 },
  upside: "Owning a category early, with compounding revenue and equity value",
  killRisk: "burning runway before reaching product-market fit",
  cost: "12–18 months of runway",
  stake: "Every month spent on the wrong bet is a month of runway you don't get back.",
  experiment:
    "a 6-week validation sprint: 20 customer interviews, a landing page with a real price, and a manual 'concierge' version of the offering",
  milestone: "10 paying customers or 3 signed letters of intent",
  window: "6 weeks",
  reversibility: "a clean rollback plan — keep the current product line alive until the new one proves itself",
  hiddenAssumption: "that customers will actually pay for this, not just say they like it in interviews",
  bias: "founders fall in love with solutions — check you're not pattern-matching to someone else's success story",
  options: [
    {
      label: "Go all-in now",
      probability: 38,
      pros: ["Speed and total focus", "Strong narrative for investors"],
      cons: ["Bets the company on unvalidated demand", "Team whiplash"],
      mitigations: ["Pre-sell before building", "Stage hiring behind milestones"],
      outcomes: [
        {
          label: "Fast PMF, raise on momentum",
          probability: 35,
          pros: ["Category leadership", "Better valuation"],
          cons: ["Scaling pains arrive early"],
          mitigations: ["Hire a strong operator early"],
        },
        {
          label: "Runway burned, forced pivot",
          probability: 65,
          pros: ["Deep market learning"],
          cons: ["Down-round or shutdown risk"],
          mitigations: ["Keep 6 months of runway in reserve at all times"],
        },
      ],
    },
    {
      label: "Validate first (6-week sprint)",
      probability: 56,
      pros: ["Cheap, fast evidence", "Keeps current revenue intact"],
      cons: ["Competitors may move first", "Half-commitment can produce weak signals"],
      mitigations: ["Time-box hard", "Use real prices, not surveys"],
      outcomes: [
        {
          label: "Demand confirmed → scale",
          probability: 55,
          pros: ["Commit with conviction and data"],
          cons: ["Six weeks of delay"],
          mitigations: ["Prepare the scale-up plan during the sprint"],
        },
        {
          label: "Weak signal → refine the ICP",
          probability: 45,
          pros: ["Avoided a costly mistake"],
          cons: ["Team morale dip"],
          mitigations: ["Celebrate the learning, publish the findings internally"],
        },
      ],
    },
    {
      label: "Stay the course",
      probability: 28,
      pros: ["Predictable execution", "No transition cost"],
      cons: ["Plateau risk", "Missed market window"],
      mitigations: ["Quarterly strategy review", "Small, cheap side bets"],
      outcomes: [
        {
          label: "Steady, slow growth",
          probability: 50,
          pros: ["Stable cash flow"],
          cons: ["Harder to raise or attract talent"],
          mitigations: ["Optimize margins and retention"],
        },
        {
          label: "Disrupted by a faster rival",
          probability: 50,
          pros: ["Clarity — the decision is made for you"],
          cons: ["Lost market share"],
          mitigations: ["Monitor competitors monthly with a trigger list"],
        },
      ],
    },
  ],
  steps: [
    { title: "Write the hypothesis", detail: "Define the ideal customer, the core pain and the price you will test.", timeframe: "Week 1" },
    { title: "Run the validation sprint", detail: "20 interviews, a priced landing page and a concierge MVP — measured weekly.", timeframe: "Weeks 2–6" },
    { title: "Set kill criteria", detail: "Agree in writing what result means stop, iterate or scale.", timeframe: "Week 2" },
    { title: "Decision board review", detail: "Present results to advisors and commit capital only behind evidence.", timeframe: "Week 7" },
  ],
  keyRisks: [
    "Runway burn before product-market fit",
    "False-positive validation from friendly customers",
    "Execution drag on the existing business",
  ],
};

const tech: Flavor = {
  key: "tech",
  matcher:
    /\b(migrat\w*|rewrite|framework|stack|cloud|kubernetes|k8s|microservices?|monolith|llm|ai|database|refactor\w*|architecture|platform|react|next\.?js|typescript|rust|golang|aws|gcp|azure|serverless)\b/i,
  base: { upside: 62, feasibility: 55, financialSafety: 56, timing: 54, personalFit: 60, resilience: 50 },
  upside: "Faster delivery, lower long-term cost and an architecture that attracts strong engineers",
  killRisk: "a half-finished migration — two systems to maintain and neither one complete",
  cost: "20–30% of engineering capacity for two quarters",
  stake: "Rewrites famously take 2–3× longer than estimated, and feature work freezes in the meantime.",
  experiment: "a strangler-fig pilot: migrate one bounded, low-risk module end to end and measure it",
  milestone: "one module in production with equal or better latency, error rate and dev velocity",
  window: "8 weeks",
  reversibility: "a feature-flagged rollback path at every stage",
  hiddenAssumption: "that the current pain comes from the technology rather than from process, ownership or missing tests",
  bias: "shiny-new-tech bias is real — make sure this isn't résumé-driven development",
  options: [
    {
      label: "Big-bang rewrite",
      probability: 22,
      pros: ["Clean slate", "Removes legacy constraints at once"],
      cons: ["Long feature freeze", "Massive estimation risk"],
      mitigations: ["Freeze scope", "Dedicated team with a hard deadline"],
      outcomes: [
        {
          label: "Ships on time, velocity jumps",
          probability: 25,
          pros: ["Modern platform, happier team"],
          cons: ["New unknown bugs"],
          mitigations: ["Invest heavily in observability"],
        },
        {
          label: "Overruns, two systems in parallel",
          probability: 75,
          pros: ["Some modernization achieved"],
          cons: ["Double maintenance cost"],
          mitigations: ["Define a 'point of no return' review"],
        },
      ],
    },
    {
      label: "Incremental migration",
      probability: 60,
      pros: ["Continuous delivery maintained", "Risk spread over time"],
      cons: ["Temporary complexity", "Requires discipline over months"],
      mitigations: ["Strangler-fig pattern", "Feature flags and contract tests"],
      outcomes: [
        {
          label: "Pilot succeeds → roll out in waves",
          probability: 60,
          pros: ["Evidence-based scaling"],
          cons: ["Long tail of legacy modules"],
          mitigations: ["Track migration % as a team KPI"],
        },
        {
          label: "Pilot reveals hidden coupling",
          probability: 40,
          pros: ["Cheap discovery of real blockers"],
          cons: ["Timeline resets"],
          mitigations: ["Map dependencies before wave two"],
        },
      ],
    },
    {
      label: "Optimize the current stack",
      probability: 40,
      pros: ["Lowest cost", "Immediate wins"],
      cons: ["Ceiling remains", "Talent attraction suffers"],
      mitigations: ["Targeted refactors", "Profiling-driven fixes"],
      outcomes: [
        {
          label: "Pain drops below threshold",
          probability: 50,
          pros: ["Problem solved without migration"],
          cons: ["Debt still accumulates"],
          mitigations: ["Re-evaluate yearly"],
        },
        {
          label: "Limits hit within a year",
          probability: 50,
          pros: ["Stronger case for migration later"],
          cons: ["Harder migration from a bigger codebase"],
          mitigations: ["Modularize now to ease future moves"],
        },
      ],
    },
  ],
  steps: [
    { title: "Baseline the metrics", detail: "Measure lead time, error rate, latency and cost before changing anything.", timeframe: "Weeks 1–2" },
    { title: "Pilot one module", detail: "Migrate a bounded, low-risk module behind a feature flag.", timeframe: "Weeks 3–8" },
    { title: "Decision review", detail: "Compare the pilot to the baseline and decide on wave-based rollout.", timeframe: "Week 9" },
    { title: "Roll out in waves", detail: "Migrate in prioritized waves with rollback paths and a public migration dashboard.", timeframe: "Quarter 2+" },
  ],
  keyRisks: [
    "Two systems running in parallel indefinitely",
    "Feature freeze hurting the business",
    "Hidden coupling discovered mid-migration",
  ],
};

const general: Flavor = {
  key: "general",
  matcher: /.*/,
  base: { upside: 60, feasibility: 56, financialSafety: 48, timing: 52, personalFit: 66, resilience: 54 },
  upside: "A meaningful step-change in quality of life, growth and new opportunities",
  killRisk: "committing financially before you've tested what daily life would actually feel like",
  cost: "a 6-month financial buffer on top of the transition costs",
  stake: "Big life moves are expensive to reverse, both financially and emotionally.",
  experiment:
    "a reversible trial — a short stay, a course, a rental, or a deep conversation with three people who have already done it",
  milestone: "clear evidence that the new reality matches the picture in your head",
  window: "60 days",
  reversibility: "an honest exit plan — what it would cost to undo this, in money and in time",
  hiddenAssumption: "that the change itself will deliver the feeling you're actually after",
  bias: "the 'grass is greener' effect — we compare our real present with an idealized future",
  options: [
    {
      label: "Commit fully now",
      probability: 36,
      pros: ["Momentum and clarity", "No lingering indecision"],
      cons: ["Hard to reverse", "Decided on imagination, not experience"],
      mitigations: ["Keep a 6-month buffer", "Negotiate flexible terms"],
      outcomes: [
        {
          label: "It fits — life improves",
          probability: 50,
          pros: ["Growth and new opportunities"],
          cons: ["Adjustment period is still hard"],
          mitigations: ["Build a support network early"],
        },
        {
          label: "Mismatch — costly reversal",
          probability: 50,
          pros: ["Clarity about what you really want"],
          cons: ["Money and time lost"],
          mitigations: ["Know the undo cost before committing"],
        },
      ],
    },
    {
      label: "Trial run first",
      probability: 58,
      pros: ["Real-world evidence", "Low cost, reversible"],
      cons: ["Delays the decision", "A trial may not feel like the real thing"],
      mitigations: ["Make the trial as realistic as possible", "Fix a decision date"],
      outcomes: [
        {
          label: "Trial confirms → commit",
          probability: 60,
          pros: ["Commit with confidence"],
          cons: ["A short delay"],
          mitigations: ["Prepare logistics during the trial"],
        },
        {
          label: "Trial disappoints → adjust",
          probability: 40,
          pros: ["Avoided a costly mistake"],
          cons: ["Disappointment"],
          mitigations: ["Identify which part didn't fit and explore alternatives"],
        },
      ],
    },
    {
      label: "Postpone 6 months",
      probability: 34,
      pros: ["Time to save and prepare", "Emotions settle"],
      cons: ["Opportunity may close", "Postponing can become permanent"],
      mitigations: ["Set a fixed revisit date", "Define what must change by then"],
      outcomes: [
        {
          label: "Better prepared later",
          probability: 50,
          pros: ["Stronger position"],
          cons: ["Conditions may change"],
          mitigations: ["Track the key conditions monthly"],
        },
        {
          label: "Window closes",
          probability: 50,
          pros: ["Decision made for you"],
          cons: ["Possible regret"],
          mitigations: ["Keep one small step moving forward"],
        },
      ],
    },
  ],
  steps: [
    { title: "Clarify the 'why'", detail: "Write down the feeling or outcome you're truly after and how you'd measure it.", timeframe: "This week" },
    { title: "Design a reversible trial", detail: "Find the cheapest realistic way to experience the new reality.", timeframe: "Weeks 2–8" },
    { title: "Price the undo", detail: "Calculate what it would cost — money and time — to reverse the decision.", timeframe: "Week 2" },
    { title: "Decide on a fixed date", detail: "Review the trial with someone who knows you well and commit either way.", timeframe: "Day 60" },
  ],
  keyRisks: [
    "Committing before experiencing the reality",
    "Underestimating emotional and financial reversal cost",
    "Idealizing the future versus the present",
  ],
};

/** Ordered by specificity — the first matcher wins, `general` is the fallback. */
export const FLAVORS: Flavor[] = [tech, startup, career, general];

export function pickFlavor(dilemma: string): Flavor {
  return FLAVORS.find((f) => f.matcher.test(dilemma)) ?? general;
}
