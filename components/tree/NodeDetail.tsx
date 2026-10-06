"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";
import type { TreeNode } from "@/lib/types";

const KIND_LABEL: Record<TreeNode["kind"], string> = {
  root: "The dilemma",
  option: "Strategic path",
  outcome: "Possible outcome",
};

function Column({ title, items, icon, tone }: { title: string; items: string[]; icon: ReactNode; tone: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <p className={`mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${tone}`}>
        {icon}
        {title}
      </p>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item} dir="auto" className="text-xs leading-relaxed text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">None identified.</p>
      )}
    </div>
  );
}

export function NodeDetail({ node }: { node: TreeNode }) {
  const metric = node.kind === "option" ? "attractiveness" : "likelihood";
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mt-4"
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[10px] uppercase tracking-[0.18em] text-red-300">{KIND_LABEL[node.kind]}</span>
        <h3 dir="auto" className="text-sm font-semibold text-white">
          {node.label}
        </h3>
        {node.probability !== undefined && (
          <span className="font-mono text-xs text-slate-400">
            {node.probability}% {metric}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Column title="Pros" items={node.pros} tone="text-red-300" icon={<ThumbsUp className="h-3.5 w-3.5" />} />
        <Column title="Cons" items={node.cons} tone="text-rose-300" icon={<ThumbsDown className="h-3.5 w-3.5" />} />
        <Column title="Mitigation" items={node.mitigations} tone="text-red-300" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
      </div>
    </motion.div>
  );
}
