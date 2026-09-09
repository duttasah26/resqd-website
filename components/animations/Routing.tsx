"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapScene, MapMarker, MapTag, ZoneCircle, siteByName } from "./MapScene";

const ORIGIN = siteByName("Cochrane"); // ~ (815, 423)
const SAFE = siteByName("Sioux Lookout"); // ~ (213, 330)
const HAZARDS = [
  { x: 560, y: 388, r: 58 },
  { x: 430, y: 362, r: 46 },
];

const ROUTES = [
  { d: "M815 423 L213 330", safe: false },
  { d: "M815 423 Q 500 286 213 330", safe: false },
  { d: "M815 423 C 760 545 430 548 330 448 C 268 402 240 360 213 330", safe: true },
];

export function Routing() {
  const reduced = useReducedMotion();
  const D = reduced ? 0 : 5;

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
            fill="#d92d20"
            fillOpacity={0.12}
            stroke="#d92d20"
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        ))}

        {ROUTES.map((r, i) => (
          <motion.path
            key={i}
            d={r.d}
            fill="none"
            stroke={r.safe ? "#16b364" : "#8b93a1"}
            strokeWidth={r.safe ? 4 : 2.5}
            strokeLinecap="round"
            strokeOpacity={r.safe ? 1 : 0.5}
            strokeDasharray={r.safe ? undefined : "6 5"}
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={
              reduced
                ? undefined
                : {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: D - 1.4,
                    delay: i * 0.3,
                  }
            }
          />
        ))}
      </svg>

      {HAZARDS.map((h, i) => (
        <MapMarker key={i} x={h.x} y={h.y} name="warning" color="#d92d20" size={18} />
      ))}
      <MapMarker x={ORIGIN.x} y={ORIGIN.y} name="home" color="#f5f5f5" size={22} />
      <MapMarker
        x={SAFE.x}
        y={SAFE.y}
        name="health_and_safety"
        color="#16b364"
        size={22}
      />

      <MapTag x={470} y={505} tone="safe">
        <motion.span
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
          transition={
            reduced
              ? undefined
              : { duration: D, repeat: Infinity, times: [0, 0.5, 0.62, 1] }
          }
        >
          Safety 82 / 100
        </motion.span>
      </MapTag>
    </MapScene>
  );
}
