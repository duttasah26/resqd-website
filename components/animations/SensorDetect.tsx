"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  MapScene,
  MapMarker,
  PulseRings,
  visibleSites,
  pctX,
  pctY,
} from "./MapScene";

// A fire ignites right in the middle of the sensor cluster.
const FIRE = { x: 300, y: 385 };
const FIRE_R = 52;
const SENSORS = visibleSites();
const NEAREST = SENSORS.reduce((a, b) =>
  Math.hypot(a.x - FIRE.x, a.y - FIRE.y) <= Math.hypot(b.x - FIRE.x, b.y - FIRE.y)
    ? a
    : b,
);

export function SensorDetect() {
  const reduced = useReducedMotion();

  return (
    <MapScene note="Work in progress. The network currently runs on simulated sensors replaying real environmental data. In production these would be physical sensors in high fire-probability areas streaming live readings.">
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <circle
          cx={FIRE.x}
          cy={FIRE.y}
          r={FIRE_R}
          fill="#d92d20"
          fillOpacity={0.18}
          stroke="#d92d20"
          strokeOpacity={0.9}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <PulseRings x={FIRE.x} y={FIRE.y} r={FIRE_R} color="#ff4d3d" period={2.6} />
      </svg>

      {SENSORS.map((s) => {
        const near = s.id === NEAREST.id;
        return (
          <MapMarker
            key={s.id}
            x={s.x}
            y={s.y}
            name="sensors"
            color={near ? "#f79009" : "#16b364"}
            size={near ? 24 : 20}
          />
        );
      })}

      <MapMarker
        x={FIRE.x}
        y={FIRE.y}
        name="local_fire_department"
        color="#d92d20"
        size={26}
      />

      <motion.div
        className="absolute -translate-y-full pb-3"
        style={{ left: pctX(NEAREST.x), top: pctY(NEAREST.y) }}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }
        }
      >
        <div className="-translate-x-1/2 rounded-md border border-urgent/60 bg-bg/90 px-2.5 py-1.5">
          <p className="readout whitespace-nowrap text-[9px] text-white/55">
            {NEAREST.id} · {NEAREST.name.toUpperCase()}
          </p>
          <p className="font-display text-sm font-bold text-text">
            Fire detected · 89%
          </p>
        </div>
      </motion.div>
    </MapScene>
  );
}
