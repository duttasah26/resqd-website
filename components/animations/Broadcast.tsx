"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapScene, MapMarker } from "./MapScene";
import { PALETTE } from "@/lib/palette";

const ORIGIN = { x: 470, y: 330 };
const RADIUS = 150;

/*
  One wave per PERIOD, growing at constant speed for WAVE seconds. A phone at
  distance d is reached at d / RADIUS * WAVE, and that is exactly when it
  pings. Phones outside the radius never ping.
*/
const PERIOD = 3;
const WAVE = 1.5;
const FADE = 0.3;

const PHONES = [
  { x: ORIGIN.x - 78, y: ORIGIN.y - 56 },
  { x: ORIGIN.x + 96, y: ORIGIN.y - 34 },
  { x: ORIGIN.x + 44, y: ORIGIN.y + 104 },
  { x: ORIGIN.x - 118, y: ORIGIN.y + 66 },
  { x: ORIGIN.x + 226, y: ORIGIN.y + 44 },
  { x: ORIGIN.x - 40, y: ORIGIN.y - 188 },
].map((p) => {
  const dist = Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y);
  return { ...p, hit: dist <= RADIUS, at: (dist / RADIUS) * WAVE };
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
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r={RADIUS}
          fill={PALETTE.urgent}
          fillOpacity={0.07}
          stroke={PALETTE.urgent}
          strokeOpacity={0.45}
          strokeDasharray="5 5"
        />

        {!reduced ? (
          <motion.circle
            cx={ORIGIN.x}
            cy={ORIGIN.y}
            fill="none"
            stroke={PALETTE.urgent}
            strokeWidth={2.5}
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: [0, RADIUS, RADIUS], opacity: [0.9, 0.7, 0.35] }}
            transition={{
              duration: WAVE + FADE,
              times: [0, WAVE / (WAVE + FADE), 1],
              ease: "linear",
              repeat: 0,
              repeatDelay: PERIOD - WAVE - FADE,
            }}
          />
        ) : null}

        {!reduced &&
          PHONES.filter((p) => p.hit).map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              fill="none"
              stroke={PALETTE.medium}
              strokeWidth={2}
              initial={{ r: 6, opacity: 0 }}
              animate={{ r: [6, 22], opacity: [0.9, 0] }}
              transition={{
                duration: 0.8,
                delay: p.at,
                repeat: 0,
                repeatDelay: PERIOD - 0.8,
                ease: "easeOut",
              }}
            />
          ))}
      </svg>

      {PHONES.map((p, i) => (
        <MapMarker
          key={i}
          x={p.x}
          y={p.y}
          name="smartphone"
          color={p.hit ? PALETTE.high : "#71717a"}
          size={p.hit ? 20 : 16}
          initial={p.hit && !reduced ? { scale: 1 } : undefined}
          animate={p.hit && !reduced ? { scale: [1, 1.2, 1] } : undefined}
          transition={
            p.hit && !reduced
              ? {
                  duration: 0.5,
                  delay: p.at,
                  repeat: 0,
                  repeatDelay: PERIOD - 0.5,
                  ease: "easeOut",
                }
              : undefined
          }
        />
      ))}

      <MapMarker
        x={ORIGIN.x}
        y={ORIGIN.y}
        name="campaign"
        color={PALETTE.urgent}
        size={26}
        initial={!reduced ? { scale: 1 } : undefined}
        animate={!reduced ? { scale: [1, 1.12, 1] } : undefined}
        transition={
          !reduced
            ? {
                duration: 0.5,
                repeat: 0,
                repeatDelay: PERIOD - 0.5,
                ease: "easeOut",
              }
            : undefined
        }
      />
    </MapScene>
  );
}
