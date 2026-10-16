"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapScene, MapMarker, visibleSites, pctX, pctY } from "./MapScene";
import { PALETTE } from "@/lib/palette";

// A fire ignites right in the middle of the sensor cluster.
const FIRE = { x: 300, y: 385 };
const FIRE_R = 52;
const SENSORS = visibleSites();
const NEAREST = SENSORS.reduce((a, b) =>
  Math.hypot(a.x - FIRE.x, a.y - FIRE.y) <=
  Math.hypot(b.x - FIRE.x, b.y - FIRE.y)
    ? a
    : b,
);

/*
  One 6-second sequence:
  0.0-2.0  the fire's heat footprint grows
  2.0      the nearest sensor trips (green to amber) and the reading appears
  5.4-6.0  holds the detected state until it scrolls out of view
*/
const D = 6;
const t = (s: number) => s / D;

export function SensorDetect() {
  const reduced = useReducedMotion();
  const loop = { duration: D, repeat: 0, ease: "easeInOut" as const };

  return (
    <MapScene>
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <motion.circle
          cx={FIRE.x}
          cy={FIRE.y}
          fill={PALETTE.urgent}
          fillOpacity={0.18}
          stroke={PALETTE.urgent}
          strokeOpacity={0.9}
          strokeWidth={2.5}
          strokeDasharray="7 5"
          initial={{ r: reduced ? FIRE_R : 8 }}
          animate={reduced ? undefined : { r: [8, FIRE_R, FIRE_R, FIRE_R] }}
          transition={
            reduced ? undefined : { ...loop, times: [0, t(2), t(5.4), 1] }
          }
        />
      </svg>

      {SENSORS.filter((s) => s.id !== NEAREST.id).map((s) => (
        <MapMarker
          key={s.id}
          x={s.x}
          y={s.y}
          name="sensors"
          color={PALETTE.safe}
          size={20}
        />
      ))}

      {/* the nearest sensor: green until the heat reaches it, then amber */}
      <MapMarker
        x={NEAREST.x}
        y={NEAREST.y}
        name="sensors"
        color={PALETTE.safe}
        size={22}
        initial={{ opacity: reduced ? 0 : 1 }}
        animate={reduced ? undefined : { opacity: [1, 1, 0, 0, 0] }}
        transition={
          reduced
            ? undefined
            : { ...loop, times: [0, t(1.9), t(2.1), t(5.4), 1] }
        }
      />
      <MapMarker
        x={NEAREST.x}
        y={NEAREST.y}
        name="sensors"
        color={PALETTE.high}
        size={24}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 1] }}
        transition={
          reduced
            ? undefined
            : { ...loop, times: [0, t(1.9), t(2.1), t(5.4), 1] }
        }
      />

      <MapMarker
        x={FIRE.x}
        y={FIRE.y}
        name="local_fire_department"
        color={PALETTE.urgent}
        size={26}
      />

      <motion.div
        className="absolute -translate-y-full pb-4"
        style={{ left: pctX(NEAREST.x), top: pctY(NEAREST.y) }}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 1] }}
        transition={
          reduced
            ? undefined
            : { ...loop, times: [0, t(2.1), t(2.4), t(5.4), 1] }
        }
      >
        <div className="-translate-x-1/2 rounded border border-urgent/60 bg-bg/90 px-2.5 py-1.5">
          <p className="whitespace-nowrap text-[11px] text-muted">
            {NEAREST.name} sensor
          </p>
          <p className="font-display text-sm font-bold text-text">
            Fire detected · 89%
          </p>
        </div>
      </motion.div>
    </MapScene>
  );
}
