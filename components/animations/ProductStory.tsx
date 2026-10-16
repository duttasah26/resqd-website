"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { productStory } from "@/lib/content";
import { useElementSize } from "@/lib/useElementSize";
import { PALETTE } from "@/lib/palette";

/*
  Product story. One incident, shown on both surfaces at once: the resident's
  phone on the left, the dispatcher console on the right. They never overlap,
  because the point is that it is the same event in both places.

  Scroll drives it: the console is pinned while the page moves through the
  steps, each segment fills with scroll progress, and any segment can be
  selected to jump there.

  Map geometry is computed in real pixels from the measured stage, so rings and
  route lines never stretch, and the alert wave reaches each phone exactly when
  that phone lights up.
*/

const STEPS = productStory.steps;
type StepKey = (typeof STEPS)[number]["key"];

const SHORT: Record<StepKey, string> = {
  detect: "Detect",
  report: "Report",
  verify: "Verify",
  broadcast: "Broadcast",
  alert: "Alert",
  route: "Route",
};

// How long each step holds before the story advances (ms).
const DWELL: Record<StepKey, number> = {
  detect: 3600,
  report: 3200,
  verify: 3200,
  broadcast: 2800,
  alert: 3800,
  route: 4600,
};

// Residents' phones around the incident, as fractions of the zone radius, so
// they always sit inside it (0.74R to 0.8R out).
const PHONE_OFFSETS = [
  { x: -0.6, y: -0.45 },
  { x: 0.55, y: -0.55 },
  { x: 0.5, y: 0.62 },
  { x: -0.55, y: 0.58 },
];

/*
  The resident's phone sits ON the map, and the map story is laid out only in
  the space the phone leaves free, so nothing is ever underneath it.

  wide (tablet, desktop): phone docked on the right, story in the area to its
  left.
  tall (phones): phone docked bottom-right, the incident plays out in the band
  above it, and the safe zone sits in the free column beside the phone.
*/
function layoutStage(W: number, H: number) {
  const inset = 12;
  const tall = W < 560;
  if (tall) {
    const phone = { w: 172, h: 300 };
    const band = H - phone.h - inset * 2;
    const inc = { x: W * 0.5, y: band * 0.52 };
    const R = band * 0.4;
    const column = W - phone.w - inset * 2;
    return {
      tall,
      phone: { ...phone, right: inset, bottom: inset },
      inc,
      R,
      sensor: { x: W * 0.13, y: band * 0.2 },
      // keep the label below the marker (about 120px wide) inside the stage
      safe: {
        x: Math.max(column / 2, 72),
        y: band + inset + (H - band - inset * 2) * 0.45,
      },
      safeTag: "below" as const,
      phones: PHONE_OFFSETS.map((o) => ({
        x: inc.x + o.x * R,
        y: inc.y + o.y * R,
      })),
      routeFrom: 3,
    };
  }
  const phone = { w: W >= 1000 ? 232 : 200, h: H - inset * 2 };
  const cw = W - phone.w - inset * 3;
  const inc = { x: cw * 0.42, y: H * 0.52 };
  const R = Math.min(cw, H) * 0.3;
  return {
    tall,
    phone: { ...phone, right: inset, bottom: inset },
    inc,
    R,
    sensor: { x: cw * 0.12, y: H * 0.24 },
    safe: { x: cw * 0.84, y: H * 0.2 },
    safeTag: "left" as const,
    phones: PHONE_OFFSETS.map((o) => ({
      x: inc.x + o.x * R,
      y: inc.y + o.y * R,
    })),
    routeFrom: 1,
  };
}

// One timing system for the whole stage.
const EASE = [0.22, 1, 0.36, 1] as const;
const WAVE = 1.2; // seconds for the alert wave to cross the zone
const WAVE_GAP = 1.2;

const URGENT = PALETTE.urgent;
const HIGH = PALETTE.high;
const SAFE_C = PALETTE.safe;

/* Each segment's fill is derived straight from scroll progress, so it is
   always right however the reader arrives, jumps or scrolls back. */
function SegFill({
  i,
  n,
  p,
}: {
  i: number;
  n: number;
  p: MotionValue<number>;
}) {
  const width = useTransform(p, [i / n, (i + 1) / n], ["0%", "100%"], {
    clamp: true,
  });
  return (
    <motion.span
      className="absolute inset-y-0 left-0 block bg-urgent"
      style={{ width }}
    />
  );
}

export function ProductStory() {
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // The story is driven by scroll: the console stays pinned while the page
  // moves through the steps, so the reader sets the pace.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 64px", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const x = Math.min(Math.max(p, 0), 0.9999) * STEPS.length;
    const s = Math.floor(x);
    setStep((cur) => (cur === s ? cur : s));
  });

  const goTo = (i: number) => {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    const span = el.offsetHeight - window.innerHeight + 64;
    window.scrollTo({
      top: top + span * ((i + 0.5) / STEPS.length),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const active = STEPS[step];

  return (
    <div
      ref={rootRef}
      style={{ height: `calc(${STEPS.length * 30}vh + 520px)` }}
    >
     <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center">
      <Console step={step} animate={!reduced} />

      {/* scrubber */}
      <div className="mt-6 flex items-start gap-3">

        <ol className="grid flex-1 grid-cols-6 gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => {
            const isActive = i === step;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  className="group flex min-h-11 w-full flex-col justify-start gap-2 pt-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                >
                  {/* every track is the same; only the fill shows progress */}
                  <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-border transition-colors group-hover:bg-[#3a3a42]">
                    <SegFill i={i} n={STEPS.length} p={scrollYProgress} />
                  </span>
                  <span
                    className={`hidden truncate text-[13px] font-medium leading-none transition-colors lg:block ${
                      isActive
                        ? "text-text"
                        : "text-muted group-hover:text-text"
                    }`}
                  >
                    {SHORT[s.key]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* caption: fixed height so the page never jumps between steps */}
      <div className="mt-5 min-h-[7rem] sm:min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <h3 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
              {active.title}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
              {active.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
     </div>
    </div>
  );
}

/* ------------------------------- Console ---------------------------------- */

function Console({ step, animate }: { step: number; animate: boolean }) {
  const [stageRef, { width: W, height: H }] = useElementSize<HTMLDivElement>();
  const L = layoutStage(W, H);
  const { inc, R, safe, sensor } = L;
  const phones = L.phones.map((q) => ({
    ...q,
    d: Math.hypot(q.x - inc.x, q.y - inc.y),
  }));

  // Route bows away from the fire: control point pushed off the midpoint,
  // directly away from the incident.
  const from = phones[L.routeFrom];
  const mx = (from.x + safe.x) / 2;
  const my = (from.y + safe.y) / 2;
  const away = Math.hypot(mx - inc.x, my - inc.y) || 1;
  const bow = Math.hypot(safe.x - from.x, safe.y - from.y) * 0.3;
  const cx = mx + ((mx - inc.x) / away) * bow;
  const cy = my + ((my - inc.y) / away) * bow;
  const routeD = `M${from.x} ${from.y} Q${cx} ${cy} ${safe.x} ${safe.y}`;

  const reported = step >= 1;
  const verified = step >= 2;
  const zone = step >= 3;
  const alerting = step === 4;
  const alerted = step >= 4;
  const routed = step >= 5;
  const ready = W > 0;

  return (
    <figure
      aria-label="Dispatcher console"
      className="flex h-[clamp(340px,52vh,520px)] flex-col overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div ref={stageRef} className="relative flex-1" aria-hidden>
        {/*
          The Red Lake basemap the hero uses. Its left half is blank (it sits
          behind the hero copy), so scale it up and show only the mapped half.
        */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/background/map_bg.png)",
            backgroundSize: "max(225%, 480px) auto",
            backgroundPosition: "100% 20%",
            backgroundColor: "#1f1f1f",
          }}
        />
        <div className="absolute inset-0 bg-bg/35" />

        {ready ? (
          <>
            <svg width={W} height={H} className="absolute inset-0">
              {/* the fire's heat footprint, present from the first frame */}
              <motion.circle
                cx={inc.x}
                cy={inc.y}
                r={R * 0.38}
                fill="url(#heat)"
                animate={
                  animate ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.85 }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <defs>
                <radialGradient id="heat">
                  <stop offset="0%" stopColor={URGENT} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={URGENT} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* broadcast zone */}
              <AnimatePresence>
                {zone ? (
                  <motion.circle
                    key="zone"
                    cx={inc.x}
                    cy={inc.y}
                    fill={URGENT}
                    fillOpacity={0.07}
                    stroke={URGENT}
                    strokeWidth={1.5}
                    strokeDasharray="6 6"
                    initial={{ r: animate ? 0 : R, opacity: 0 }}
                    animate={{ r: R, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                ) : null}
              </AnimatePresence>

              {/* alert wave: constant speed, so arrival time = distance */}
              {alerting && animate ? (
                <motion.circle
                  key={`wave-${step}`}
                  cx={inc.x}
                  cy={inc.y}
                  fill="none"
                  stroke={URGENT}
                  strokeWidth={2}
                  initial={{ r: 0, opacity: 0.8 }}
                  animate={{ r: R, opacity: [0.8, 0.8, 0] }}
                  transition={{
                    duration: WAVE,
                    times: [0, 0.75, 1],
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: WAVE_GAP,
                  }}
                />
              ) : null}

              {/* safest route */}
              <AnimatePresence>
                {routed ? (
                  <motion.path
                    key="route"
                    d={routeD}
                    fill="none"
                    stroke={SAFE_C}
                    strokeWidth={3}
                    strokeLinecap="round"
                    initial={{ pathLength: animate ? 0 : 1, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
                  />
                ) : null}
              </AnimatePresence>
            </svg>

            {/* safe zone: always on the map, highlighted once routed */}
            <Pin x={safe.x} y={safe.y}>
              <Glyph icon="health_and_safety" color={SAFE_C} dim={!routed} />
              <Tag show={routed} color={SAFE_C} side={L.safeTag}>
                Red Lake Arena
              </Tag>
            </Pin>

            {/* sensor */}
            <Pin x={sensor.x} y={sensor.y}>
              {step === 0 && animate ? (
                <Ping color={URGENT} period={1.6} />
              ) : null}
              <Glyph icon="sensors" color={step === 0 ? URGENT : "#a1a1aa"} />
              <Tag show={step === 0} color={URGENT} side="right">
                Heat + smoke · 89%
              </Tag>
            </Pin>

            {/* phones in the area */}
            {phones.map((p, i) => (
              <Pin key={i} x={p.x} y={p.y}>
                {alerting && animate ? (
                  <Ping
                    color={HIGH}
                    period={WAVE + WAVE_GAP}
                    delay={(p.d / R) * WAVE}
                    once
                  />
                ) : null}
                <motion.span
                  className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 leading-none"
                  initial={false}
                  animate={{ color: alerted ? HIGH : "rgba(255,255,255,0.45)" }}
                  transition={{
                    duration: 0.2,
                    delay: alerting && animate ? (p.d / R) * WAVE : 0,
                  }}
                >
                  <Icon
                    name="smartphone"
                    size={16}
                    filled
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }}
                  />
                </motion.span>
              </Pin>
            ))}

            {/* the incident itself */}
            <AnimatePresence>
              {reported ? (
                <motion.div
                  key="incident"
                  className="absolute"
                  style={{ left: inc.x, top: inc.y }}
                  initial={{ opacity: 0, scale: animate ? 0.5 : 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {!verified && animate ? (
                    <Ping color={HIGH} period={1.6} />
                  ) : null}
                  <Glyph
                    icon={verified ? "local_fire_department" : "photo_camera"}
                    color={verified ? URGENT : HIGH}
                  />
                  <Tag
                    show={step === 1 || step === 2}
                    color={step === 1 ? HIGH : URGENT}
                    side="right"
                  >
                    {step === 1
                      ? "Citizen report · pending"
                      : "Incident · high"}
                  </Tag>
                </motion.div>
              ) : null}
            </AnimatePresence>
            {/* the resident's phone, docked in the space kept clear for it */}
            <div
              className="absolute z-20"
              style={{
                width: L.phone.w,
                height: L.phone.h,
                right: L.phone.right,
                bottom: L.phone.bottom,
              }}
            >
              <Phone step={step} animate={animate} compact={L.tall} />
            </div>
          </>
        ) : null}
      </div>
    </figure>
  );
}

function Pin({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {children}
    </div>
  );
}

/** A 32px marker centred on its point. */
function Glyph({
  icon,
  color,
  dim = false,
}: {
  icon: string;
  color: string;
  dim?: boolean;
}) {
  return (
    <span
      className="absolute left-0 top-0 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full transition-opacity duration-300"
      style={{
        background: `${color}26`,
        boxShadow: `0 0 0 1.5px ${color}`,
        opacity: dim ? 0.55 : 1,
      }}
    >
      <Icon name={icon} size={16} filled color={color} />
    </span>
  );
}

/** A ring that grows out of a marker. */
function Ping({
  color,
  period,
  delay = 0,
  once = false,
}: {
  color: string;
  period: number;
  delay?: number;
  once?: boolean;
}) {
  const duration = once ? 0.8 : period;
  return (
    <motion.span
      className="absolute left-0 top-0 h-8 w-8 rounded-full border-2"
      style={{ borderColor: color, x: "-50%", y: "-50%" }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: [0.6, 1.9], opacity: [0.8, 0] }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: period - duration,
      }}
    />
  );
}

/** Label beside a marker, never on top of it. */
function Tag({
  show,
  color,
  side,
  children,
}: {
  show: boolean;
  color: string;
  side: "left" | "right" | "below";
  children: ReactNode;
}) {
  const place =
    side === "right"
      ? { left: 24, top: 0, y: "-50%" }
      : side === "left"
        ? { right: 24, top: 0, y: "-50%" }
        : { left: 0, top: 22, x: "-50%" };
  // One slot: when the text changes, the old label leaves before the new one
  // arrives, so two labels never stack on the same marker.
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.span
          key={typeof children === "string" ? children : "tag"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="absolute whitespace-nowrap rounded border bg-bg/90 px-2 py-1 text-[11px] font-semibold"
          style={{ borderColor: `${color}99`, color, ...place }}
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------- Phone ----------------------------------- */

function Phone({
  step,
  animate,
  compact,
}: {
  step: number;
  animate: boolean;
  compact: boolean;
}) {
  const key = STEPS[step].key;
  return (
    <figure
      aria-label="Resident's phone"
      className="h-full w-full rounded-[30px] border border-white/20 bg-black p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[#0f0f11]">
        <div className="flex h-8 shrink-0 items-center justify-between px-5 pt-1">
          <span className="text-[11px] font-semibold text-white tabular-nums">
            9:41
          </span>
          <Icon
            name="signal_cellular_alt"
            size={12}
            color="rgba(255,255,255,0.8)"
          />
        </div>
        {compact ? null : (
          <div className="flex shrink-0 items-center gap-1.5 px-4 pb-2 pt-1">
            <Icon name="pin" size={12} color="rgba(255,255,255,0.6)" />
            <span className="text-[11px] text-white/60">Red Lake, ON</span>
          </div>
        )}

        <div className="relative flex-1 px-3 pb-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={key}
              initial={{ opacity: 0, y: animate ? 8 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: animate ? -6 : 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex h-full flex-col"
            >
              <Screen stepKey={key} animate={animate} compact={compact} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}

function Screen({
  stepKey,
  animate,
  compact,
}: {
  stepKey: StepKey;
  animate: boolean;
  compact: boolean;
}) {
  switch (stepKey) {
    case "detect":
      return (
        <>
          <p className="px-1 text-[15px] font-semibold text-white">
            Report a fire
          </p>
          <div
            className="mt-3 grid flex-1 place-content-center rounded-xl"
            style={{
              background:
                "linear-gradient(160deg, rgba(247,144,9,0.45), rgba(217,45,32,0.55) 60%, rgba(40,10,8,0.9))",
            }}
          >
            <Icon name="local_fire_department" size={44} filled color="#fff" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-1">
            <Icon name="pin" size={13} color="rgba(255,255,255,0.7)" />
            <span className="text-[12px] text-white/70">Norseman Inn Rd</span>
          </div>
          <PhoneButton tone="urgent">Send report</PhoneButton>
        </>
      );
    case "report":
      return (
        <Status
          compact={compact}
          icon="check"
          color={HIGH}
          title="Report sent"
          body="Your photo is uploaded. Dispatch will review it shortly."
        >
          <Checklist
            items={[
              { label: "Photo uploaded", done: true },
              { label: "Waiting for review", done: false },
            ]}
          />
        </Status>
      );
    case "verify":
      return (
        <Status
          compact={compact}
          icon="verified_user"
          color={SAFE_C}
          title="Report verified"
          body="Dispatch confirmed the fire and opened an incident."
        >
          <Checklist
            items={[
              { label: "Photo uploaded", done: true },
              { label: "Verified by dispatch", done: true },
            ]}
          />
        </Status>
      );
    case "broadcast":
      return (
        <Status
          compact={compact}
          icon="shield"
          color="#a1a1aa"
          title="No alerts yet"
          body="The app checks for alerts in your area every 15 seconds."
        >
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-white/50"
              initial={{ width: "0%" }}
              animate={{ width: animate ? "100%" : "60%" }}
              transition={{ duration: DWELL.broadcast / 1000, ease: "linear" }}
            />
          </div>
        </Status>
      );
    case "alert":
      return (
        <div
          className={`flex h-full flex-col rounded-xl bg-urgent ${compact ? "p-3" : "p-4"}`}
        >
          <Icon name="warning" size={compact ? 22 : 26} filled color="#fff" />
          <p
            className={`mt-3 font-bold leading-tight text-white ${compact ? "text-[16px]" : "text-[18px]"}`}
          >
            Evacuation order
          </p>
          <p className="mt-2 text-[13px] leading-snug text-white/90">
            Leave the area now. Active fire near Norseman Inn Rd.
          </p>
          {compact ? null : (
            <div className="mt-auto space-y-1 text-[12px] text-white/85">
              <p>Priority: urgent</p>
              <p>Zone radius: 2.5 km</p>
            </div>
          )}
          <span className="mt-auto grid h-10 place-content-center rounded-lg bg-white text-[12px] font-semibold text-urgent">
            Show safest route
          </span>
        </div>
      );
    case "route":
      return (
        <>
          <p className="px-1 text-[15px] font-semibold text-white">
            Safest route
          </p>
          <div className="mt-3 rounded-xl border border-safe/40 bg-safe/10 p-3">
            <p className="text-[12px] text-white/70">Safety score</p>
            <p className="font-display text-[28px] font-bold leading-none text-safe">
              92<span className="text-[15px] text-white/60"> / 100</span>
            </p>
            {compact ? null : (
              <p className="mt-1.5 text-[12px] text-white/70">
                Stays clear of the fire
              </p>
            )}
          </div>
          <div className="mt-2 flex-1 rounded-xl bg-white/[0.06] p-3">
            <div className="flex items-center gap-1.5">
              <Icon name="health_and_safety" size={14} filled color={SAFE_C} />
              <span className="text-[13px] font-semibold text-white">
                Red Lake Arena
              </span>
            </div>
            {compact ? null : (
              <p className="mt-1 text-[12px] text-white/60">Shelter · open</p>
            )}
            <p className="mt-3 text-[13px] text-white tabular-nums">
              6 min · 3.1 km
            </p>
          </div>
          <PhoneButton tone="safe">Start route</PhoneButton>
        </>
      );
  }
}

/*
  A status screen. In the compact phone (about 135px of usable width) the
  type steps down and the secondary detail is dropped, so nothing clips.
*/
function Status({
  icon,
  color,
  title,
  body,
  compact,
  children,
}: {
  icon: string;
  color: string;
  title: string;
  body: string;
  compact: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col justify-center ${compact ? "px-1" : "px-2"}`}
    >
      <span
        className={`grid place-content-center rounded-full ${compact ? "h-10 w-10" : "h-12 w-12"}`}
        style={{ background: `${color}26` }}
      >
        <Icon name={icon} size={compact ? 20 : 24} filled color={color} />
      </span>
      <p
        className={`font-semibold leading-tight text-white ${compact ? "mt-3 text-[15px]" : "mt-4 text-[17px]"}`}
      >
        {title}
      </p>
      <p
        className={`mt-1.5 leading-snug text-white/70 ${compact ? "text-[12px]" : "text-[13px]"}`}
      >
        {body}
      </p>
      {compact ? null : children}
    </div>
  );
}

function Checklist({ items }: { items: { label: string; done: boolean }[] }) {
  return (
    <ul className="mt-5 space-y-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-[12px]">
          {it.done ? (
            <Icon name="check_circle" size={14} filled color={SAFE_C} />
          ) : (
            <span className="grid h-3.5 w-3.5 place-content-center">
              <span className="h-2 w-2 animate-pulse rounded-full bg-high" />
            </span>
          )}
          <span className={it.done ? "text-white/85" : "text-white/70"}>
            {it.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PhoneButton({
  tone,
  children,
}: {
  tone: "urgent" | "safe";
  children: ReactNode;
}) {
  return (
    <span
      className={`mt-3 grid h-10 shrink-0 place-content-center rounded-lg text-[13px] font-semibold text-white ${
        tone === "urgent" ? "bg-urgent" : "bg-[#0b7a43]"
      }`}
    >
      {children}
    </span>
  );
}
