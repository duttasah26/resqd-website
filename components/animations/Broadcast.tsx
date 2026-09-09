"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapScene, MapMarker, PulseRings } from "./MapScene";

const ORIGIN = { x: 470, y: 330 };
const RADIUS = 150;
const PERIOD = 3;

const PHONES = [
  { x: ORIGIN.x - 78, y: ORIGIN.y - 56 },
  { x: ORIGIN.x + 96, y: ORIGIN.y - 34 },
  { x: ORIGIN.x + 44, y: ORIGIN.y + 104 },
  { x: ORIGIN.x - 118, y: ORIGIN.y + 66 },
  { x: ORIGIN.x + 226, y: ORIGIN.y + 44 },
  { x: ORIGIN.x - 40, y: ORIGIN.y - 188 },
].map((p) => {
  const dist = Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y);
  return { ...p, dist, hit: dist <= RADIUS };
});

export function Broadcast() {
  const reduced = useReducedMotion();

  return (
    <MapScene>
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <PulseRings x={ORIGIN.x} y={ORIGIN.y} r={RADIUS} color="#d92d20" period={PERIOD} />
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r={RADIUS}
          fill="#d92d20"
          fillOpacity={0.07}
          stroke="#d92d20"
          strokeOpacity={0.4}
          strokeDasharray="5 5"
        />

        {/* each in-range phone pings as the wave reaches it */}
        {!reduced &&
          PHONES.filter((p) => p.hit).map((p, i) => {
            const t = (p.dist / RADIUS) * PERIOD * 0.55;
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={13}
                fill="none"
                stroke="#fdb022"
                strokeWidth={2}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.6], opacity: [0.9, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: PERIOD - 1.1,
                  delay: t,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
            );
          })}
      </svg>

      {PHONES.map((p, i) => {
        const t = (p.dist / RADIUS) * PERIOD * 0.55;
        return (
          <MapMarker
            key={i}
            x={p.x}
            y={p.y}
            name="smartphone"
            color={p.hit ? "#f79009" : "#6b7280"}
            size={p.hit ? 20 : 16}
            initial={p.hit && !reduced ? { scale: 0.85 } : undefined}
            animate={p.hit && !reduced ? { scale: [0.85, 1.2, 1] } : undefined}
            transition={
              p.hit && !reduced
                ? {
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: PERIOD - 1,
                    delay: t,
                    ease: "easeOut",
                  }
                : undefined
            }
          />
        );
      })}

      <MapMarker x={ORIGIN.x} y={ORIGIN.y} name="campaign" color="#d92d20" size={26} />
    </MapScene>
  );
}
