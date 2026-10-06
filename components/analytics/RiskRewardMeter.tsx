"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Gauge, ShieldAlert, Sparkles } from "lucide-react";
import { riskReward } from "@/lib/scoring";
import type { RadarScores } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { Skeleton } from "../ui/Skeleton";

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.7, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span>{rounded}</motion.span>;
}

function Bar({ label, value, icon, color }: { label: string; value: number; icon: ReactNode; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-400">
          {icon}
          {label}
        </span>
        <span className="font-mono text-slate-200">
          <AnimatedNumber value={value} />
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}

const ARC_LENGTH = Math.PI * 80;

export function RiskRewardMeter({ scores }: { scores: RadarScores | null }) {
  if (!scores) {
    return (
      <GlassCard title="Decision Index" icon={<Gauge className="h-4 w-4 text-amber-300" />}>
        <Skeleton className="mx-auto h-28 w-48" />
        <Skeleton className="mt-6 h-3 w-full" />
        <Skeleton className="mt-4 h-3 w-full" />
      </GlassCard>
    );
  }

  const { risk, reward, index } = riskReward(scores);
  const color = index >= 60 ? "#34d399" : index >= 45 ? "#fbbf24" : "#fb7185";

  return (
    <GlassCard title="Decision Index" icon={<Gauge className="h-4 w-4 text-amber-300" />}>
      <div className="relative mx-auto w-52">
        <svg viewBox="0 0 200 110" className="w-full">
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" strokeLinecap="round" />
          <motion.path
            d="M20 100 A80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            animate={{ strokeDashoffset: ARC_LENGTH * (1 - index / 100), stroke: color }}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-mono text-4xl font-bold text-white">
            <AnimatedNumber value={index} />
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">reward-to-risk</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Bar label="Reward potential" value={reward} color="#22d3ee" icon={<Sparkles className="h-3.5 w-3.5 text-cyan-300" />} />
        <Bar label="Risk exposure" value={risk} color="#fbbf24" icon={<ShieldAlert className="h-3.5 w-3.5 text-amber-300" />} />
      </div>
    </GlassCard>
  );
}
