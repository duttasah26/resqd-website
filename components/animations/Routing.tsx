"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  MapScene,
  MapMarker,
  ZoneCircle,
  siteByName,
  pctX,
  pctY,
} from "./MapScene";
import { PALETTE } from "@/lib/palette";

const ORIGIN = siteByName("Cochrane"); // ~ (815, 423)
const SAFE = siteByName("Sioux Lookout"); // ~ (213, 330)
const HAZARDS = [
  { x: 560, y: 388, r: 58 },
  { x: 430, y: 362, r: 46 },
];

// Two direct candidates that cut through the hazards, and the one that's kept.
const REJECTED = ["M815 423 L213 330", "M815 423 Q 500 286 213 330"];
const SAFE_ROUTE =
  "M815 423 C 770 300 560 215 400 240 C 310 254 250 290 213 330";
const SCORE = { x: 500, y: 200 };

/*
  One 6-second sequence, every element on the same clock:
  0.0-1.2  the two direct candidates draw
  1.2-1.6  they're rejected (fade back)
  1.6-2.9  the safe route draws around the hazards
  2.9      the safety score appears
  5.4-6.0  holds the finished route until it scrolls out of view
*/
const D = 6;
const t = (s: number) => s / D;

export function Routing() {
  const reduced = useReducedMotion();
  const loop = { duration: D, repeat: 0, ease: "easeInOut" as const };

  return (
    <MapScene>
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <ZoneCircle x={SAFE.x} y={SAFE.y} r={54} />

        {HAZARDS.map((h, i) => (
          <circle
            key={i}
            cx={h.x}
            cy={h.y}
            r={h.r}
            fill={PALETTE.urgent}
            fillOpacity={0.12}
            stroke={PALETTE.urgent}
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        ))}

        {REJECTED.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#a1a1aa"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={
              reduced
                ? { pathLength: 1, opacity: 0.3 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={
              reduced
                ? undefined
                : {
                    pathLength: [0, 0, 1, 1, 1, 1],
                    opacity: [0, 0.8, 0.8, 0.25, 0.25, 0.25],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    ...loop,
                    times: [0, t(i * 0.3), t(0.9 + i * 0.3), t(1.6), t(5.4), 1],
                  }
            }
          />
        ))}

        <motion.path
          d={SAFE_ROUTE}
          fill="none"
          stroke={PALETTE.safe}
          strokeWidth={4}
          strokeLinecap="round"
          initial={
            reduced
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          animate={
            reduced
              ? undefined
              : { pathLength: [0, 0, 1, 1, 1], opacity: [0, 1, 1, 1, 1] }
          }
          transition={
            reduced
              ? undefined
              : { ...loop, times: [0, t(1.6), t(2.9), t(5.4), 1] }
          }
        />
      </svg>

      {HAZARDS.map((h, i) => (
        <MapMarker
          key={i}
          x={h.x}
          y={h.y}
          name="warning"
          color={PALETTE.urgent}
          size={18}
        />
      ))}
      <MapMarker
        x={ORIGIN.x}
        y={ORIGIN.y}
        name="home"
        color="#f5f5f5"
        size={22}
      />
      <MapMarker
        x={SAFE.x}
        y={SAFE.y}
        name="health_and_safety"
        color={PALETTE.safe}
        size={22}
      />

      {/* the whole label fades, so there is never an empty box on the map */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded border border-safe/60 bg-bg/90 px-2 py-1 text-[11px] font-semibold text-safe"
        style={{ left: pctX(SCORE.x), top: pctY(SCORE.y) }}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 1] }}
        transition={
          reduced
            ? undefined
            : { ...loop, times: [0, t(2.9), t(3.2), t(5.4), 1] }
        }
      >
        Safety 82 / 100
      </motion.div>
    </MapScene>
  );
}
