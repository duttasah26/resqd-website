"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { useElementSize } from "@/lib/useElementSize";
import { PALETTE } from "@/lib/palette";

type Level = "low" | "med" | "high";

interface FireEntity {
  kind: "fire";
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  severity: Level;
  containment: number;
  reported: string;
  crews: string;
  category: string;
}

interface SafeEntity {
  kind: "safe";
  id: string;
  x: number;
  y: number;
  ring: number;
  title: string;
  subtitle: string;
  status: "Open" | "At capacity" | "Closed";
  capacity: number;
  occupancy: number;
  distance: string;
  category: string;
}

interface BroadcastEntity {
  kind: "broadcast";
  id: string;
  x: number;
  y: number;
  ring: number;
  title: string;
  subtitle: string;
  priority: Level;
  delivered: number;
  reach: string;
  radius: string;
  sent: string;
}

interface SensorEntity {
  kind: "sensor";
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  likelihood: number;
  reading: string;
  updated: string;
}

type Entity = FireEntity | SafeEntity | BroadcastEntity | SensorEntity;

/*
  Positions are % of the map box. They keep every 44px marker at least ~60px
  from its neighbours on the desktop layout, so nothing overlaps on hover, and
  they leave the lower left of the box clear for the docked inspector.
*/
const FIRES: FireEntity[] = [
  {
    kind: "fire",
    id: "f1",
    x: 50,
    y: 19,
    title: "Structure fire",
    subtitle: "Norseman Inn Rd",
    severity: "high",
    containment: 25,
    reported: "14 min ago",
    crews: "2 crews assigned",
    category: "Wildfire",
  },
  {
    kind: "fire",
    id: "f2",
    x: 84,
    y: 8,
    title: "Grass fire",
    subtitle: "Kelson's Farm",
    severity: "med",
    containment: 55,
    reported: "1 hr ago",
    crews: "1 crew assigned",
    category: "Wildfire",
  },
  {
    kind: "fire",
    id: "f3",
    x: 70,
    y: 26,
    title: "Spot fire",
    subtitle: "Howey Bay Rd",
    severity: "low",
    containment: 80,
    reported: "2 hr ago",
    crews: "1 crew assigned",
    category: "Wildfire",
  },
];

const SAFE: SafeEntity = {
  kind: "safe",
  id: "s1",
  x: 88,
  y: 60,
  ring: 142,
  title: "Red Lake Arena",
  subtitle: "Evacuation shelter",
  status: "Open",
  capacity: 400,
  occupancy: 182,
  distance: "3.1 km from nearest fire",
  category: "Shelter",
};

const BROADCAST: BroadcastEntity = {
  kind: "broadcast",
  id: "b1",
  x: 62,
  y: 13,
  ring: 195,
  title: "Evacuation broadcast",
  subtitle: "Norseman Inn Rd zone",
  priority: "high",
  delivered: 94,
  reach: "1,240 devices",
  radius: "2.5 km",
  sent: "6 min ago",
};

const SENSOR: SensorEntity = {
  kind: "sensor",
  id: "n1",
  x: 82,
  y: 22,
  title: "Sensor 04",
  subtitle: "Norseman Inn Rd",
  likelihood: 82,
  reading: "Heat and smoke rising",
  updated: "30 s ago",
};

// Phones inside the broadcast radius.
const PHONES = [
  { x: 54.5, y: 4 },
  { x: 73.4, y: 4 },
  { x: 46, y: 9.7 },
  { x: 58.3, y: 27.2 },
];
// On phones: one device, inside the ring but clear of the cluster.
const PHONES_COMPACT = [{ x: 72, y: 42 }];

const ALL: Entity[] = [...FIRES, SAFE, BROADCAST, SENSOR];

const levelColor: Record<Level, string> = {
  low: PALETTE.safe,
  med: PALETTE.high,
  high: PALETTE.urgent,
};
const levelWord: Record<Level, string> = {
  low: "LOW",
  med: "MED",
  high: "HIGH",
};

// One broadcast wave every PERIOD seconds. It grows at constant speed for WAVE
// seconds, so a phone at distance d from the origin is reached at d / r * WAVE.
const PERIOD = 3;
const WAVE = 1.6;
const FADE = 0.3;

export function HeroMap() {
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = ALL.find((e) => e.id === openId) ?? null;
  const reduced = useReducedMotion() ?? false;
  const [boxRef, { width: W, height: H }] = useElementSize<HTMLDivElement>();
  // Loops run only while the map is on screen; they restart together (so the
  // wave and the phone pings stay in phase) when it scrolls back into view.
  const inView = useInView(boxRef, { amount: 0.1 });
  const still = reduced || !inView;

  // Below the sm breakpoint the map is a short, display-only strip.
  const compact = useIsPhone();

  const phones = compact ? PHONES_COMPACT : PHONES;
  const bRing = compact ? 122 : BROADCAST.ring;
  const sRing = compact ? 78 : SAFE.ring;
  const safeX = compact ? 83 : SAFE.x;
  const safeY = compact ? 74 : SAFE.y;

  const delays = phones.map((p) => {
    const d = Math.hypot(
      ((p.x - BROADCAST.x) / 100) * W,
      ((p.y - BROADCAST.y) / 100) * H,
    );
    return Math.min(d / (bRing / 2), 1) * WAVE;
  });

  const markerProps = (id: string) => ({
    active: openId === id,
    onClick: () => setOpenId((cur) => (cur === id ? null : id)),
  });

  // Close on Escape or on a click anywhere outside the map's markers and card.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-map-ui]")) setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openId]);

  const place = shown ? placeCard(shown, W, H) : null;

  return (
    <div
      ref={boxRef}
      className="pointer-events-none relative h-[168px] w-full sm:h-[460px] lg:h-[600px] lg:self-start"
    >
      <RadiusRing
        x={BROADCAST.x}
        y={BROADCAST.y}
        size={bRing}
        color={PALETTE.urgent}
      />
      <BroadcastWave reduced={still} size={bRing} />
      <RadiusRing x={safeX} y={safeY} size={sRing} color={PALETTE.safe} />

      {W > 0
        ? phones.map((p, i) => (
            <AnimatedPhone
              key={i}
              x={p.x}
              y={p.y}
              delay={delays[i]}
              reduced={still}
            />
          ))
        : null}

      {compact ? (
        <>
          <StaticMarker x={BROADCAST.x} y={BROADCAST.y}>
            <BroadcastIcon reduced={still} size={22} />
          </StaticMarker>
          <StaticMarker x={FIRES[0].x} y={FIRES[0].y}>
            <MarkerIcon
              name="local_fire_department"
              color={levelColor.high}
              size={22}
            />
          </StaticMarker>
          <StaticMarker x={safeX} y={safeY}>
            <MarkerIcon
              name="health_and_safety"
              color={PALETTE.safe}
              size={22}
            />
          </StaticMarker>
        </>
      ) : W > 0 ? (
        <>
          <MarkerButton
            x={BROADCAST.x}
            y={BROADCAST.y}
            label="Broadcast details"
            {...markerProps(BROADCAST.id)}
          >
            <BroadcastIcon reduced={still} />
          </MarkerButton>

          <MarkerButton
            x={SENSOR.x}
            y={SENSOR.y}
            label="Sensor details"
            {...markerProps(SENSOR.id)}
          >
            <span
              className={`grid h-7 w-7 place-content-center rounded-full bg-urgent/15 ring-1 ring-urgent/70`}
            >
              <Icon name="sensors" size={16} filled color="#ff5a4d" />
            </span>
          </MarkerButton>

          {FIRES.map((f) => (
            <MarkerButton
              key={f.id}
              x={f.x}
              y={f.y}
              label={`${f.title} details`}
              {...markerProps(f.id)}
            >
              <MarkerIcon
                name="local_fire_department"
                color={levelColor[f.severity]}
              />
            </MarkerButton>
          ))}

          <MarkerButton
            x={SAFE.x}
            y={SAFE.y}
            label="Safe zone details"
            {...markerProps(SAFE.id)}
          >
            <MarkerIcon name="health_and_safety" color={PALETTE.safe} />
          </MarkerButton>

          {/* inspector, opened by click, placed beside its marker */}
          <AnimatePresence>
            {shown && place ? (
              <motion.div
                key={shown.id}
                data-map-ui
                className="absolute z-30"
                style={{ left: place.left, top: place.top, width: CARD_W }}
                initial={{ opacity: 0, x: place.dx * 6, y: place.dy * 6 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <InspectorCard entity={shown} onClose={() => setOpenId(null)} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}

const CARD_W = 264;
const CARD_H = 236;
const GAP = 10;
const HIT = 22; // half a marker's 44px hit area

/*
  Put the card right beside its marker. Try the four sides and pick the one
  that covers the fewest other markers while staying inside the map box.
*/
function placeCard(e: Entity, W: number, H: number) {
  const mx = (e.x / 100) * W;
  const my = (e.y / 100) * H;
  const right = mx + HIT + GAP;
  const left = mx - HIT - GAP - CARD_W;
  const options = [
    { left: right, top: my - HIT, dx: -1, dy: 0 },
    { left, top: my - HIT, dx: 1, dy: 0 },
    { left: right, top: my + HIT - CARD_H, dx: -1, dy: 0 },
    { left, top: my + HIT - CARD_H, dx: 1, dy: 0 },
    { left: mx - CARD_W / 2, top: my + HIT + GAP, dx: 0, dy: -1 },
  ];
  const others = [
    ...ALL.filter((o) => o.id !== e.id).map((o) => ({ ...o, w: 3 })),
    ...PHONES.map((p) => ({ ...p, w: 1 })),
  ].map((o) => ({ x: (o.x / 100) * W, y: (o.y / 100) * H, w: o.w }));

  const score = (o: (typeof options)[number]) => {
    const covered = others.reduce((sum, m) => {
      const hit =
        m.x + HIT > o.left &&
        m.x - HIT < o.left + CARD_W &&
        m.y + HIT > o.top &&
        m.y - HIT < o.top + CARD_H;
      return sum + (hit ? m.w : 0);
    }, 0);
    const spill =
      Math.max(0, -o.left) +
      Math.max(0, o.left + CARD_W - W) +
      Math.max(0, -o.top) +
      Math.max(0, o.top + CARD_H - H);
    return covered * 100 + spill;
  };
  return options.reduce((best, o) => (score(o) < score(best) ? o : best));
}

const PHONE_QUERY = "(max-width: 639px)";
function useIsPhone() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(PHONE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

function MarkerIcon({
  name,
  color,
  size = 28,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <Icon
      name={name}
      size={size}
      filled
      color={color}
      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
    />
  );
}

function StaticMarker({
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
      className="pointer-events-none absolute z-10 grid -translate-x-1/2 -translate-y-1/2 place-content-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </span>
  );
}

function BroadcastIcon({
  reduced,
  size = 26,
}: {
  reduced: boolean;
  size?: number;
}) {
  // A small kick each time a wave leaves the tower.
  return (
    <motion.span
      className="block leading-none"
      animate={reduced ? undefined : { scale: [1, 1.12, 1] }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: PERIOD - 0.5,
        ease: "easeOut",
      }}
    >
      <MarkerIcon name="campaign" color={PALETTE.urgent} size={size} />
    </motion.span>
  );
}

function RadiusRing({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        border: `1.5px dashed ${color}`,
        backgroundColor: `${color}12`,
        opacity: 0.6,
      }}
    />
  );
}

function BroadcastWave({ reduced, size }: { reduced: boolean; size: number }) {
  if (reduced) return null;
  // One ring per period at constant speed, so the phone pings can be timed to it.
  return (
    <motion.span
      className="absolute rounded-full border-2 border-[#ff3b2f]"
      style={{
        left: `${BROADCAST.x}%`,
        top: `${BROADCAST.y}%`,
        width: size,
        height: size,
        x: "-50%",
        y: "-50%",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1], opacity: [0.9, 0.7, 0] }}
      transition={{
        duration: WAVE + FADE,
        times: [0, WAVE / (WAVE + FADE), 1],
        ease: "linear",
        repeat: Infinity,
        repeatDelay: PERIOD - WAVE - FADE,
      }}
    />
  );
}

function AnimatedPhone({
  x,
  y,
  delay,
  reduced,
}: {
  x: number;
  y: number;
  delay: number;
  reduced: boolean;
}) {
  const t = {
    duration: 0.8,
    delay,
    repeat: Infinity,
    repeatDelay: PERIOD - 0.8,
    ease: "easeOut" as const,
  };
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {!reduced ? (
        <motion.span
          className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full border border-high"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 2.4], opacity: [0.8, 0] }}
          transition={t}
        />
      ) : null}
      <motion.span
        className="relative block leading-none"
        animate={reduced ? undefined : { scale: [1, 1.25, 1] }}
        transition={t}
      >
        <Icon
          name="smartphone"
          size={15}
          filled
          color={PALETTE.high}
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}
        />
      </motion.span>
    </span>
  );
}

function MarkerButton({
  x,
  y,
  active,
  onClick,
  label,
  children,
}: {
  x: number;
  y: number;
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      data-map-ui
      className={`pointer-events-auto absolute z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        active ? "bg-white/10 ring-2 ring-white/50" : "hover:bg-white/10"
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </button>
  );
}

function InspectorCard({
  entity,
  onClose,
}: {
  entity: Entity;
  onClose: () => void;
}) {
  const accent =
    entity.kind === "fire"
      ? levelColor[entity.severity]
      : entity.kind === "broadcast"
        ? levelColor[entity.priority]
        : entity.kind === "sensor"
          ? PALETTE.urgent
          : PALETTE.safe;
  const badge =
    entity.kind === "fire"
      ? levelWord[entity.severity]
      : entity.kind === "broadcast"
        ? "URGENT"
        : entity.kind === "sensor"
          ? "ALERT"
          : entity.status.toUpperCase();

  return (
    <div className="pointer-events-auto rounded-lg border border-white/10 bg-[#141416]/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-bold tracking-wide"
          style={{ backgroundColor: `${accent}26`, color: accent }}
        >
          {badge}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="-m-2 grid h-9 w-9 place-content-center rounded text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" size={14} />
        </button>
      </div>

      <p className="mt-2.5 font-display text-lg font-bold leading-tight text-text">
        {entity.title}
      </p>
      <p className="text-xs text-muted">{entity.subtitle}</p>

      <div className="mt-3 space-y-2.5">
        {entity.kind === "fire" ? (
          <>
            <SeverityRow label="Severity" level={entity.severity} />
            <BarRow
              label="Containment"
              value={`${entity.containment}%`}
              pct={entity.containment}
              color={accent}
            />
            <Row label="Reported" value={entity.reported} />
            <Row label="Response" value={entity.crews} />
            <Row label="Category" value={entity.category} />
          </>
        ) : entity.kind === "broadcast" ? (
          <>
            <SeverityRow label="Priority" level={entity.priority} />
            <BarRow
              label="Delivered"
              value={`${entity.delivered}%`}
              pct={entity.delivered}
              color={accent}
            />
            <Row label="Reach" value={entity.reach} />
            <Row label="Radius" value={entity.radius} />
            <Row label="Sent" value={entity.sent} />
          </>
        ) : entity.kind === "sensor" ? (
          <>
            <BarRow
              label="Fire likelihood"
              value={`${entity.likelihood}%`}
              pct={entity.likelihood}
              color={accent}
            />
            <Row label="Reading" value={entity.reading} />
            <Row label="Updated" value={entity.updated} />
          </>
        ) : (
          <>
            <Row
              label="Status"
              value={entity.status}
              valueColor={PALETTE.safe}
            />
            <Row label="Capacity" value={`${entity.capacity} people`} />
            <BarRow
              label="Occupancy"
              value={`${entity.occupancy} / ${entity.capacity}`}
              pct={Math.round((entity.occupancy / entity.capacity) * 100)}
              color={PALETTE.safe}
            />
            <Row label="Distance" value={entity.distance} />
            <Row label="Category" value={entity.category} />
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-medium" style={{ color: valueColor ?? "#f5f5f5" }}>
        {value}
      </span>
    </div>
  );
}

function SeverityRow({ label, level }: { label: string; level: Level }) {
  const segs = level === "low" ? 1 : level === "med" ? 2 : 3;
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-3 rounded-sm"
              style={{
                backgroundColor: i < segs ? levelColor[level] : "#ffffff1f",
              }}
            />
          ))}
        </span>
        <span
          className="text-[11px] font-bold"
          style={{ color: levelColor[level] }}
        >
          {levelWord[level]}
        </span>
      </span>
    </div>
  );
}

function BarRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
