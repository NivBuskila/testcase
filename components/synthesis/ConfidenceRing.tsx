"use client";

import { motion } from "framer-motion";

const R = 26;
const CIRC = 2 * Math.PI * R;

export function ConfidenceRing({ value }: { value: number }) {
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="#f87171"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - value / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-bold text-white">{value}%</span>
        <span className="text-[8px] uppercase tracking-wider text-slate-500">conf.</span>
      </div>
    </div>
  );
}
