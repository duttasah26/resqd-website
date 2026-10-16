"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  MapScene,
  MapMarker,
  MapTag,
  siteByName,
  visibleSites,
} from "./MapScene";
import { PALETTE } from "@/lib/palette";

/*
  One map for every platform feature. The basemap, the sensors and the fire
  stay put; scrolling only changes what the map is doing:

  Each step shows only the icons it needs (sensors are gone once the focus
  moves to routing and broadcast), so the map never accumulates clutter:

  0 detect    the nearest sensor trips and flags the fire
  1 map       the incident, a pending citizen report and a safe zone
  2 routing   the fire's buffer grows and a route bends around it
  3 broadcast the buffer becomes the evacuation zone, phones inside alert
  4 sync      the circle settles and a new report lands on the map
*/

const FIRE = { x: 500, y: 378 };
const HOME = siteByName("Cochrane");
const SAFE = siteByName("Sioux Lookout");
const REPORT = { x: 640, y: 462 };
const REPORT_NEW = { x: 330, y: 452 };
const ROUTE = `M${HOME.x} ${HOME.y} C 770 300 560 215 400 240 C 310 254 250 290 ${SAFE.x} ${SAFE.y}`;

// radius of the circle around the fire at each step
const RADIUS = [46, 46, 74, 122, 46];

const PHONES = [
  { dx: -78, dy: -52, hit: true },
  { dx: 66, dy: -74, hit: true },
  { dx: 92, dy: 42, hit: true },
  { dx: -44, dy: 78, hit: true },
  { dx: -200, dy: 64, hit: false },
  { dx: 196, dy: -46, hit: false },
  { dx: 150, dy: 132, hit: false },
];

const TAGS: { x: number; y: number; text: string; tone: "urgent" | "safe" }[] = [
  { x: 0, y: 0, text: "Fire detected · 89%", tone: "urgent" },
  { x: FIRE.x, y: FIRE.y - 66, text: "Incident · high", tone: "urgent" },
  { x: 470, y: 196, text: "Safety 82 / 100", tone: "safe" },
  { x: FIRE.x, y: FIRE.y - 146, text: "Evacuation order · 4 phones", tone: "urgent" },
  { x: REPORT_NEW.x, y: REPORT_NEW.y - 34, text: "New report · photo", tone: "urgent" },
];

export function PlatformMap({
  step,
  still = false,
}: {
  step: number;
  /** Show this step's final state with no entrance or fade (phones). */
  still?: boolean;
}) {
  const reduced = (useReducedMotion() ?? false) || still;
  const sensors = visibleSites();
  const nearest = sensors.reduce((a, b) =>
    Math.hypot(a.x - FIRE.x, a.y - FIRE.y) <=
    Math.hypot(b.x - FIRE.x, b.y - FIRE.y)
      ? a
      : b,
  );

  const ease = { duration: reduced ? 0 : 0.7, ease: "easeInOut" as const };
  const show = (on: boolean, delay = 0) => ({
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay },
  });

  const tag = step === 0 ? { ...TAGS[0], x: nearest.x, y: nearest.y - 30 } : TAGS[step];

  return (
    <MapScene always={still}>
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* safe zone */}
        <motion.circle
          cx={SAFE.x}
          cy={SAFE.y}
          r={54}
          fill={PALETTE.safe}
          fillOpacity={0.1}
          stroke={PALETTE.safe}
          strokeOpacity={0.55}
          strokeDasharray="5 4"
          initial={{ opacity: 0 }}
          {...show(step === 1 || step === 2)}
        />

        {/* the circle around the fire: heat footprint, hazard buffer, then the
            evacuation zone, one shape that grows */}
        <motion.circle
          cx={FIRE.x}
          cy={FIRE.y}
          fill={PALETTE.urgent}
          fillOpacity={0.14}
          stroke={PALETTE.urgent}
          strokeOpacity={0.7}
          strokeWidth={2}
          strokeDasharray="6 5"
          initial={{ r: reduced ? RADIUS[step] : 8 }}
          animate={{ r: RADIUS[step] }}
          transition={ease}
        />

        {/* the route, drawn around the buffer */}
        <motion.path
          d={ROUTE}
          fill="none"
          stroke={PALETTE.safe}
          strokeWidth={4}
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
          animate={{
            pathLength: step === 2 ? 1 : 0,
            opacity: step === 2 ? 1 : 0,
          }}
          transition={{ duration: reduced ? 0 : 1.1, ease: "easeInOut" }}
        />

        {/* broadcast pulse, once, as the order goes out */}
        {step === 3 && !reduced ? (
          <motion.circle
            cx={FIRE.x}
            cy={FIRE.y}
            fill="none"
            stroke={PALETTE.urgent}
            strokeWidth={2}
            initial={{ r: 20, opacity: 0.9 }}
            animate={{ r: RADIUS[3], opacity: 0 }}
            transition={{ duration: 1.1, repeat: 1, ease: "easeOut" }}
          />
        ) : null}

        {/* new report ripple */}
        {step === 4 && !reduced ? (
          <motion.circle
            cx={REPORT_NEW.x}
            cy={REPORT_NEW.y}
            fill="none"
            stroke={PALETTE.high}
            strokeWidth={2}
            initial={{ r: 8, opacity: 0.9 }}
            animate={{ r: 40, opacity: 0 }}
            transition={{ duration: 1, repeat: 1, ease: "easeOut" }}
          />
        ) : null}
      </svg>

      {/* sensors: always there */}
      {sensors
        .filter((s) => s.id !== nearest.id)
        .map((s) => (
          <MapMarker
            key={s.id}
            x={s.x}
            y={s.y}
            name="sensors"
            color={PALETTE.safe}
            size={20}
            initial={{ opacity: 1 }}
            animate={{ opacity: step === 0 ? 1 : step === 1 ? 0.35 : 0 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
          />
        ))}
      <MapMarker
        x={nearest.x}
        y={nearest.y}
        name="sensors"
        color={PALETTE.safe}
        size={22}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.3 }}
      />
      <MapMarker
        x={nearest.x}
        y={nearest.y}
        name="sensors"
        color={PALETTE.high}
        size={24}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={{ opacity: step === 0 ? 1 : step === 1 ? 0.5 : 0 }}
        transition={{
          duration: 0.4,
          delay: reduced || step !== 0 ? 0 : 1.3,
        }}
      />

      {/* the fire */}
      <MapMarker
        x={FIRE.x}
        y={FIRE.y}
        name="local_fire_department"
        color={PALETTE.urgent}
        size={26}
        initial={{ scale: reduced ? 1 : 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.2 }}
      />

      {/* safe zone marker */}
      <MapMarker
        x={SAFE.x}
        y={SAFE.y}
        name="health_and_safety"
        color={PALETTE.safe}
        size={22}
        initial={{ opacity: 0 }}
        {...show(step === 1 || step === 2)}
      />

      {/* origin of the route */}
      <MapMarker
        x={HOME.x}
        y={HOME.y}
        name="home"
        color="#f5f5f5"
        size={22}
        initial={{ opacity: 0 }}
        {...show(step === 2)}
      />

      {/* a pending citizen report, then a newly landed one */}
      <MapMarker
        x={REPORT.x}
        y={REPORT.y}
        name="photo_camera"
        color={PALETTE.high}
        size={20}
        initial={{ opacity: 0 }}
        {...show(step === 1, 0.3)}
      />
      <MapMarker
        x={REPORT_NEW.x}
        y={REPORT_NEW.y}
        name="photo_camera"
        color={PALETTE.high}
        size={22}
        initial={{ opacity: 0 }}
        {...show(step === 4)}
      />

      {/* phones: appear with the broadcast, the ones inside alert */}
      {PHONES.map((p, i) => (
        <MapMarker
          key={i}
          x={FIRE.x + p.dx}
          y={FIRE.y + p.dy}
          name="smartphone"
          color={p.hit ? PALETTE.high : "#71717a"}
          size={p.hit ? 20 : 16}
          initial={{ opacity: 0 }}
          {...show(step === 3, 0.25 + i * 0.07)}
        />
      ))}

      {/* one small label at a time; the map itself never fades */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25, delay: 0 }}
        >
          <MapTag x={tag.x} y={tag.y} tone={tag.tone}>
            {tag.text}
          </MapTag>
        </motion.div>
      </AnimatePresence>
    </MapScene>
  );
}
