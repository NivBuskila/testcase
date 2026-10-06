"use client";

import { motion } from "framer-motion";

const BARS = [0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8];

export function VoiceWave({ color, active }: { color: string; active: boolean }) {
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {BARS.map((peak, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          animate={active ? { height: ["20%", `${peak * 100}%`, "30%", `${peak * 70}%`, "20%"] } : { height: "15%" }}
          transition={active ? { duration: 0.9 + i * 0.07, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}
