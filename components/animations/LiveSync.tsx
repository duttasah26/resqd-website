"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { PALETTE } from "@/lib/palette";

/*
  A citizen report reaching every dispatcher. One 6-second timeline, beats in
  order: the phone sends, the packet reaches S3 + API, the event fans out to
  both consoles at the same moment, and the pin drops on both maps together.

  Drawn on the same 1000x600 canvas as the map scenes (fixed aspect ratio, so
  the svg scales uniformly and lines never stretch). Labels live in the strip
  below the canvas, at readable sizes.
*/

const W = 1000;
const H = 600;

// node geometry, canvas units
const PHONE = { x: 90, y: 160, w: 150, h: 280 };
const API = { cx: 500, cy: 300, s: 132 };
const SCREENS = [
  { x: 730, y: 92, w: 220, h: 156 },
  { x: 730, y: 352, w: 220, h: 156 },
];

const WIRE_IN = `M${PHONE.x + PHONE.w} ${API.cy} L${API.cx - API.s / 2} ${API.cy}`;
const WIRES_OUT = SCREENS.map((s) => {
  const sx = API.cx + API.s / 2;
  const ty = s.y + s.h / 2;
  return `M${sx} ${API.cy} C ${sx + 80} ${API.cy}, ${s.x - 80} ${ty}, ${s.x} ${ty}`;
});

// Beats, in ms. Index = phase.
const BEATS = [700, 900, 600, 800, 2200, 700];
const PH = {
  send: 0,
  upload: 1,
  store: 2,
  fanout: 3,
  landed: 4,
  reset: 5,
} as const;

const STEPS = [
  { label: "Photo sent to S3", phases: [PH.send, PH.upload] },
  { label: "API emits the event", phases: [PH.store, PH.fanout] },
  { label: "Pin on every map", phases: [PH.landed, PH.reset] },
];

const HIGH = PALETTE.high;
const URGENT = PALETTE.urgent;
const WIRE = "#2a2a30";
const EASE = [0.22, 1, 0.36, 1] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function LiveSync({ still = false }: { still?: boolean }) {
  const reduced = (useReducedMotion() ?? false) || still;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [phase, setPhase] = useState<number>(PH.send);
  const shown = reduced ? PH.landed : phase;

  useEffect(() => {
    if (reduced) return;
    // play once per visit, hold the landed pin, replay when it re-enters view
    if (!inView) {
      if (phase === PH.send) return;
      const id = setTimeout(() => setPhase(PH.send), 0);
      return () => clearTimeout(id);
    }
    if (phase >= PH.landed) return;
    const id = setTimeout(() => setPhase((p) => p + 1), BEATS[phase]);
    return () => clearTimeout(id);
  }, [phase, inView, reduced]);

  const sec = (ms: number) => ms / 1000;
  const landed = shown >= PH.landed;
  const fading = shown === PH.reset;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-hidden
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
        >
          {/* wires */}
          <path d={WIRE_IN} stroke={WIRE} strokeWidth={3} fill="none" />
          {WIRES_OUT.map((d, i) => (
            <path key={i} d={d} stroke={WIRE} strokeWidth={3} fill="none" />
          ))}

          {/* packet: a short lit segment travelling along the wire */}
          <AnimatePresence>
            {shown === PH.upload ? (
              <Packet
                key="in"
                d={WIRE_IN}
                color={HIGH}
                duration={sec(BEATS[PH.upload])}
              />
            ) : null}
            {shown === PH.fanout
              ? WIRES_OUT.map((d, i) => (
                  <Packet
                    key={`out${i}`}
                    d={d}
                    color={URGENT}
                    duration={sec(BEATS[PH.fanout])}
                  />
                ))
              : null}
          </AnimatePresence>

          {/* phone */}
          <rect
            x={PHONE.x}
            y={PHONE.y}
            width={PHONE.w}
            height={PHONE.h}
            rx={22}
            fill="#0f0f11"
            stroke="#3a3a42"
            strokeWidth={2}
          />
          <rect
            x={PHONE.x + 14}
            y={PHONE.y + 22}
            width={PHONE.w - 28}
            height={150}
            rx={10}
            fill="url(#photo)"
          />
          <defs>
            <linearGradient id="photo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={HIGH} stopOpacity="0.55" />
              <stop offset="100%" stopColor={URGENT} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* send bar fills during the send beat */}
          <rect
            x={PHONE.x + 14}
            y={PHONE.y + PHONE.h - 56}
            width={PHONE.w - 28}
            height={34}
            rx={8}
            fill="#1c1c20"
          />
          <motion.rect
            x={PHONE.x + 14}
            y={PHONE.y + PHONE.h - 56}
            height={34}
            rx={8}
            fill={URGENT}
            initial={false}
            animate={{
              width:
                shown === PH.send
                  ? PHONE.w - 28
                  : shown === PH.reset
                    ? 0
                    : PHONE.w - 28,
              opacity: shown === PH.reset ? 0 : 1,
            }}
            transition={{
              duration: shown === PH.send ? sec(BEATS[PH.send]) : 0.3,
              ease: shown === PH.send ? "linear" : EASE,
            }}
          />

          {/* API node */}
          <motion.rect
            x={API.cx - API.s / 2}
            y={API.cy - API.s / 2}
            width={API.s}
            height={API.s}
            rx={16}
            fill="#1c1c20"
            strokeWidth={2}
            initial={false}
            animate={{
              stroke:
                shown === PH.store || shown === PH.fanout ? URGENT : "#3a3a42",
            }}
            transition={{ duration: 0.2 }}
          />

          {/* dispatcher screens */}
          {SCREENS.map((s, i) => (
            <g key={i}>
              <rect
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                rx={12}
                fill="#121214"
                stroke="#3a3a42"
                strokeWidth={2}
              />
              <rect
                x={s.x}
                y={s.y}
                width={s.w}
                height={26}
                rx={12}
                fill="#1c1c20"
              />
              <path
                d={`M${s.x + 10} ${s.y + 112} C ${s.x + 70} ${s.y + 92}, ${s.x + 120} ${s.y + 128}, ${s.x + s.w - 10} ${s.y + 96}`}
                stroke="#2f2f36"
                strokeWidth={3}
                fill="none"
              />
              <path
                d={`M${s.x + 80} ${s.y + 30} C ${s.x + 92} ${s.y + 80}, ${s.x + 130} ${s.y + 110}, ${s.x + 140} ${s.y + s.h - 4}`}
                stroke="#2f2f36"
                strokeWidth={3}
                fill="none"
              />
            </g>
          ))}
        </svg>

        {/* icons over the canvas, centred on their nodes */}
        <Glyph x={PHONE.x + PHONE.w / 2} y={PHONE.y + 22 + 75}>
          <Icon name="photo_camera" size={22} filled color="#fff" />
        </Glyph>
        <Glyph x={API.cx} y={API.cy}>
          <Icon name="dns" size={24} color="#d4d4d8" />
        </Glyph>

        {SCREENS.map((s, i) => {
          const px = s.x + s.w * 0.58;
          const py = s.y + s.h * 0.6;
          return (
            <Glyph key={i} x={px} y={py}>
              <AnimatePresence>
                {landed && !fading ? (
                  <motion.span
                    key="pin"
                    className="relative grid place-content-center"
                    initial={
                      reduced ? false : { opacity: 0, y: -10, scale: 0.6 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {!reduced ? (
                      <motion.span
                        className="absolute left-1/2 top-1/2 h-6 w-6 rounded-full border-2"
                        style={{ borderColor: HIGH, x: "-50%", y: "-50%" }}
                        initial={{ scale: 0.6, opacity: 0.9 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                      />
                    ) : null}
                    <Icon name="photo_camera" size={18} filled color={HIGH} />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </Glyph>
          );
        })}
      </div>

      {/* labels, in step with the beats */}
      <ol className="grid grid-cols-3 border-t border-border">
        {STEPS.map((s, i) => {
          const active = (s.phases as readonly number[]).includes(shown);
          return (
            <li
              key={s.label}
              className={`flex items-baseline gap-2 px-3 py-3 text-[13px] transition-colors duration-200 sm:px-4 ${
                i > 0 ? "border-l border-border" : ""
              } ${active ? "text-text" : "text-muted"}`}
            >
              <span
                className={`readout !text-[12px] tabular-nums ${active ? "text-urgent-text" : ""}`}
              >
                {i + 1}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Glyph({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <span
      className="absolute grid -translate-x-1/2 -translate-y-1/2 place-content-center leading-none"
      style={{ left: pct(x, W), top: pct(y, H) }}
    >
      {children}
    </span>
  );
}

function Packet({
  d,
  color,
  duration,
}: {
  d: string;
  color: string;
  duration: number;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="0.18 1.2"
      initial={{ strokeDashoffset: 0.18, opacity: 1 }}
      animate={{ strokeDashoffset: -1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration, ease: "easeInOut" }}
    />
  );
}
