"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapScene, MapMarker, siteByName } from "./MapScene";
import { PALETTE } from "@/lib/palette";

const PINS = [
  {
    ...siteByName("Cochrane"),
    icon: "local_fire_department",
    color: PALETTE.urgent,
    delay: 0.1,
  },
  {
    ...siteByName("Dryden"),
    icon: "photo_camera",
    color: PALETTE.high,
    delay: 0.5,
  },
  {
    ...siteByName("Sioux Lookout"),
    icon: "photo_camera",
    color: PALETTE.high,
    delay: 0.9,
  },
  {
    ...siteByName("Thunder Bay"),
    icon: "health_and_safety",
    color: PALETTE.safe,
    delay: 1.3,
  },
  {
    ...siteByName("Red Lake"),
    icon: "local_fire_department",
    color: PALETTE.urgent,
    delay: 1.7,
  },
];

export function LiveMap() {
  const reduced = useReducedMotion();
  const D = reduced ? 0 : 6;

  return (
    <MapScene>
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <motion.circle
          cx={PINS[0].x}
          cy={PINS[0].y}
          r={80}
          fill={PALETTE.urgent}
          fillOpacity={0.08}
          stroke={PALETTE.urgent}
          strokeOpacity={0.45}
          initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
          animate={
            reduced
              ? { scale: 1, opacity: 1 }
              : { scale: [0, 1, 1, 1], opacity: [0, 1, 1, 1] }
          }
          transition={
            reduced
              ? undefined
              : { duration: D, repeat: 0, times: [0, 0.08, 0.9, 1] }
          }
          style={{ transformOrigin: `${PINS[0].x}px ${PINS[0].y}px` }}
        />
      </svg>

      {PINS.map((p, i) => (
        <MapMarker
          key={i}
          x={p.x}
          y={p.y}
          name={p.icon}
          color={p.color}
          size={22}
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.4 }}
          animate={
            reduced
              ? { opacity: 1, scale: 1 }
              : { opacity: [0, 1, 1, 1, 1], scale: [0.4, 1.18, 1, 1, 1] }
          }
          transition={
            reduced
              ? undefined
              : {
                  duration: D,
                  repeat: 0,
                  delay: p.delay,
                  times: [0, 0.04, 0.08, 0.92, 1],
                  ease: "easeOut",
                }
          }
        />
      ))}
    </MapScene>
  );
}
