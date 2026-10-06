"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend } from "recharts";
import { Radar as RadarIcon } from "lucide-react";
import { RADAR_AXES } from "@/lib/agents";
import type { RadarScores } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { Skeleton } from "../ui/Skeleton";

interface RiskRadarProps {
  base: RadarScores | null;
  current: RadarScores | null;
}

export function RiskRadar({ base, current }: RiskRadarProps) {
  const data =
    base && current ? RADAR_AXES.map(({ key, label }) => ({ axis: label, initial: base[key], current: current[key] })) : [];

  return (
    <GlassCard title="Risk vs. Reward Radar" icon={<RadarIcon className="h-4 w-4 text-red-300" />}>
      {data.length === 0 ? (
        <Skeleton className="mx-auto h-64 w-64 rounded-full" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="rgba(148,163,184,0.18)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Initial read"
                dataKey="initial"
                stroke="#64748b"
                strokeDasharray="4 4"
                fill="#64748b"
                fillOpacity={0.08}
                isAnimationActive={false}
              />
              <Radar
                name="After debate"
                dataKey="current"
                stroke="#f87171"
                strokeWidth={2}
                fill="#f87171"
                fillOpacity={0.25}
                animationDuration={700}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} iconType="circle" iconSize={8} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
