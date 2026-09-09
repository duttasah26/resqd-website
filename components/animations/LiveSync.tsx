"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { AnimFrame } from "./AnimFrame";
import { Icon } from "@/components/ui/Icon";

export function LiveSync() {
  const reduced = useReducedMotion();
  const loop = (extra: Transition = {}): Transition | undefined =>
    reduced ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut", ...extra };

  return (
    <AnimFrame>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 py-4">
        {/* 1 — civilian */}
        <Node icon="photo_camera" color="#f79009" caption="1 · Civilian" />

        <Wire reduced={reduced}>
          <motion.span
            className="absolute h-2 w-2 rounded-full bg-high"
            initial={{ left: "0%", opacity: 0 }}
            animate={reduced ? { left: "100%", opacity: 1 } : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={loop({ times: [0, 0.15, 0.85, 1] })}
          />
        </Wire>

        {/* 2 — S3 + API */}
        <div className="flex flex-col items-center gap-2">
          <Node icon="dns" color="#a1a1aa" caption="2 · S3 + API" />
        </div>

        <Wire reduced={reduced}>
          <motion.span
            className="absolute h-2 w-2 rounded-full bg-urgent"
            initial={{ left: "0%", opacity: 0 }}
            animate={reduced ? { left: "100%", opacity: 1 } : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={loop({ delay: reduced ? 0 : 1.8, times: [0, 0.15, 0.85, 1] })}
          />
        </Wire>

        {/* 3 — every dispatcher */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface-2"
              >
                <Icon name="desktop_windows" size={16} color="#a1a1aa" />
                <motion.span
                  className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-urgent"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={reduced ? { scale: 1, opacity: 1 } : { scale: [0, 0, 1.3, 1], opacity: [0, 0, 1, 1] }}
                  transition={loop({ times: [0, 0.62, 0.74, 1] })}
                />
              </div>
            ))}
          </div>
          <span className="label text-[9px] text-muted">3 · Every dispatcher</span>
        </div>
      </div>

      <p className="label mt-1 text-[10px] text-muted/70">
        14 real-time event types keep every client in step
      </p>
    </AnimFrame>
  );
}

function Node({
  icon,
  color,
  caption,
}: {
  icon: string;
  color: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface-2">
        <Icon name={icon} size={20} color={color} filled />
      </div>
      <span className="label text-[9px] text-muted">{caption}</span>
    </div>
  );
}

function Wire({
  reduced,
  children,
}: {
  reduced: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-px w-full bg-border">
      {!reduced && children}
    </div>
  );
}
