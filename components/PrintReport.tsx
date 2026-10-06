import { AGENTS, RADAR_AXES } from "@/lib/agents";
import { riskReward } from "@/lib/scoring";
import type { DebateMessage, RadarScores, Synthesis, TreeNode } from "@/lib/types";

interface PrintReportProps {
  dilemma: string;
  messages: DebateMessage[];
  scores: RadarScores | null;
  synthesis: Synthesis | null;
  tree: TreeNode | null;
}

/** Light, printer-friendly report. Only rendered on paper / "Save as PDF". */
export function PrintReport({ dilemma, messages, scores, synthesis, tree }: PrintReportProps) {
  const rr = scores ? riskReward(scores) : null;
  return (
    <div className="hidden bg-white p-8 font-sans text-[12px] leading-relaxed text-slate-900 print:block">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">DecisionForge AI · Decision Report · {new Date().toLocaleDateString()}</p>
      <h1 dir="auto" className="mt-1 text-2xl font-bold">
        {dilemma}
      </h1>

      {synthesis && (
        <section className="mt-5 rounded-lg border border-slate-300 p-4">
          <p className="font-mono text-sm font-bold">
            {synthesis.verdict} · {synthesis.confidence}% confidence
            {rr && ` · Decision index ${rr.index}/100 (reward ${rr.reward}, risk ${rr.risk})`}
          </p>
          <p dir="auto" className="mt-1 font-semibold">{synthesis.headline}</p>
          <p dir="auto" className="mt-2">{synthesis.summary}</p>
        </section>
      )}

      {scores && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Scorecard</h2>
          <table className="mt-2 w-full border-collapse">
            <tbody>
              <tr>
                {RADAR_AXES.map(({ key, label }) => (
                  <td key={key} className="border border-slate-300 p-2 text-center">
                    <div className="text-lg font-bold">{scores[key]}</div>
                    <div className="text-[10px] text-slate-500">{label}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {synthesis && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider">Action plan</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {synthesis.steps.map((s, i) => (
              <li key={`${s.title}-${i}`} dir="auto">
                <strong>{s.title}</strong> ({s.timeframe}) — {s.detail}
              </li>
            ))}
          </ol>
          {synthesis.keyRisks.length > 0 && (
            <>
              <h2 className="mt-4 text-sm font-bold uppercase tracking-wider">Key risks</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {synthesis.keyRisks.map((r) => (
                  <li key={r} dir="auto">{r}</li>
                ))}
              </ul>
            </>
          )}
          {synthesis.constraintsApplied.length > 0 && (
            <p className="mt-3 text-slate-600">Constraints applied: {synthesis.constraintsApplied.join(" · ")}</p>
          )}
        </section>
      )}

      {tree && (
        <section className="mt-5 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider">Decision paths</h2>
          <ul className="mt-2 space-y-2">
            {tree.children.map((o) => (
              <li key={o.id}>
                <strong dir="auto">{o.label}</strong> ({o.probability}% attractiveness)
                <ul className="list-disc pl-5 text-slate-700">
                  {o.children.map((c) => (
                    <li key={c.id} dir="auto">
                      {c.label} — {c.probability}% likely. Mitigation: {c.mitigations.join("; ") || "—"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <h2 className="text-sm font-bold uppercase tracking-wider">Debate transcript</h2>
        <div className="mt-2 space-y-2">
          {messages.map((m) => (
            <p key={m.id} dir="auto" className="break-inside-avoid">
              <strong>
                {AGENTS[m.agentId].name} ({AGENTS[m.agentId].title})
                {m.constraint ? ` · re: "${m.constraint}"` : ""}:
              </strong>{" "}
              {m.content}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
