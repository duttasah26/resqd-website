"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";

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

type Entity = FireEntity | SafeEntity | BroadcastEntity;

const FIRES: FireEntity[] = [
  {
    kind: "fire",
    id: "f1",
    x: 54,
    y: 12,
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

const SENSOR = { x: 82, y: 22, reading: 82 };
const PHONES = [
  { x: 42, y: 26 },
  { x: 78, y: 28 },
  { x: 58, y: 3 },
  { x: 88, y: 40 },
];
// On phones: one device, pushed well away from the fire/broadcast cluster at
// the top of the ring but still inside it, so it reads as its own point.
const PHONES_COMPACT = [{ x: 72, y: 42 }];

const ALL: Entity[] = [...FIRES, SAFE, BROADCAST];

const levelColor: Record<Level, string> = {
  low: "#16b364",
  med: "#f79009",
  high: "#d92d20",
};
const levelWord: Record<Level, string> = { low: "LOW", med: "MED", high: "HIGH" };

const WAVE_PERIOD = 3;

// How far each phone sits from the broadcast origin, normalised 0..1, so the
// alert "reaches" the nearest phone first and the farthest one last.
function phoneDelays(phones: { x: number; y: number }[]) {
  const d = phones.map((p) =>
    Math.hypot(p.x - BROADCAST.x, p.y - BROADCAST.y),
  );
  const max = Math.max(...d, 0.001);
  return d.map((v) => (v / max) * 2);
}

export function HeroMap() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ALL.find((e) => e.id === openId) ?? null;
  const toggle = (id: string) =>
    setOpenId((cur) => (cur === id ? null : id));
  const reduced = useReducedMotion() ?? false;

  // On narrow screens the marker-anchored inspector card runs off the edge, so
  // below this width we dock it to the bottom of the map instead.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => {
      setCompact(mq.matches);
      // the phone map is display-only, so never leave a popup open on it
      if (mq.matches) setOpenId(null);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const phones = compact ? PHONES_COMPACT : PHONES;
  const delays = phoneDelays(phones);
  // The map is a short strip on phones; shrink the rings so they read as
  // circles inside the frame rather than clipped arcs.
  const bRing = compact ? 122 : BROADCAST.ring;
  const sRing = compact ? 78 : SAFE.ring;
  // On phones only the fire sits with the broadcast; the shelter gets its own
  // corner, lower and pulled off the right edge, well clear of the cluster.
  const safeX = compact ? 83 : SAFE.x;
  const safeY = compact ? 74 : SAFE.y;

  return (
    <div className="pointer-events-none relative h-[168px] w-full sm:h-[460px] lg:h-[600px] lg:self-start">
      {/* radii */}
      <RadiusRing x={BROADCAST.x} y={BROADCAST.y} size={bRing} color="#d92d20" />
      <BroadcastWave reduced={reduced} size={bRing} />
      <RadiusRing x={safeX} y={safeY} size={sRing} color="#16b364" />

      {/* phones in the broadcast radius, lighting up as the alert reaches them */}
      {phones.map((p, i) => (
        <AnimatedPhone
          key={i}
          x={p.x}
          y={p.y}
          delay={delays[i]}
          reduced={reduced}
        />
      ))}

      {compact ? (
        /*
          Phones get a stripped-down, display-only map: fewer markers and
          nothing tappable, so it reads as an illustration, not a widget.
        */
        <>
          <StaticMarker x={BROADCAST.x} y={BROADCAST.y}>
            <BroadcastIcon reduced={reduced} size={22} />
          </StaticMarker>
          <StaticMarker x={FIRES[0].x} y={FIRES[0].y}>
            <Icon
              name="local_fire_department"
              size={22}
              filled
              color={levelColor[FIRES[0].severity]}
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
            />
          </StaticMarker>
          <StaticMarker x={safeX} y={safeY}>
            <Icon
              name="health_and_safety"
              size={22}
              filled
              color="#16b364"
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
            />
          </StaticMarker>
        </>
      ) : (
        <>
          {/* broadcast marker */}
          <MarkerButton
            x={BROADCAST.x}
            y={BROADCAST.y}
            active={openId === BROADCAST.id}
            onClick={() => toggle(BROADCAST.id)}
            label="Broadcast details"
          >
            <BroadcastIcon reduced={reduced} />
          </MarkerButton>

          {/* at-risk sensor */}
          <SensorPin />

          {/* fires, tinted by severity */}
          {FIRES.map((f) => (
            <MarkerButton
              key={f.id}
              x={f.x}
              y={f.y}
              active={openId === f.id}
              onClick={() => toggle(f.id)}
              label={`${f.title} details`}
            >
              <Icon
                name="local_fire_department"
                size={28}
                filled
                color={levelColor[f.severity]}
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
              />
            </MarkerButton>
          ))}

          {/* safe zone */}
          <MarkerButton
            x={SAFE.x}
            y={SAFE.y}
            active={openId === SAFE.id}
            onClick={() => toggle(SAFE.id)}
            label="Safe zone details"
          >
            <Icon
              name="health_and_safety"
              size={28}
              filled
              color="#16b364"
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
            />
          </MarkerButton>
        </>
      )}

      {/*
        Inspector popup, anchored to the open marker. Kept mounted (outside the
        compact branch) so switching layouts never unmounts it mid-animation.
      */}
      <AnimatePresence>
        {!compact && open ? (
          <InspectorCard
            key={open.id}
            entity={open}
            onClose={() => setOpenId(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
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
  return (
    <motion.span
      className="block"
      animate={reduced ? undefined : { scale: [1, 1.14, 1] }}
      transition={{
        duration: WAVE_PERIOD,
        times: [0, 0.12, 0.5],
        repeat: Infinity,
        ease: "easeOut",
      }}
    >
      <Icon
        name="campaign"
        size={size}
        filled
        color="#d92d20"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))" }}
      />
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
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderColor: color,
        borderStyle: "dashed",
        borderWidth: 1.5,
        backgroundColor: `${color}12`,
        opacity: 0.6,
      }}
    />
  );
}

function BroadcastWave({
  reduced,
  size = BROADCAST.ring,
}: {
  reduced: boolean;
  size?: number;
}) {
  if (reduced) {
    return (
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d92d20]/60"
        style={{
          left: `${BROADCAST.x}%`,
          top: `${BROADCAST.y}%`,
          width: size,
          height: size,
        }}
      />
    );
  }
  // Each ring starts as a dot on the icon and grows outward to the dashed
  // boundary. Width/height animate (not scale) so the stroke stays crisp.
  return (
    <span
      className="absolute left-0 top-0"
      style={{ left: `${BROADCAST.x}%`, top: `${BROADCAST.y}%` }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-0 top-0 rounded-full border-2 border-[#ff3b2f]"
          style={{ boxShadow: "0 0 14px 1px rgba(217,45,32,0.45)" }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0 }}
          animate={{
            width: [0, size],
            height: [0, size],
            x: [0, -size / 2],
            y: [0, -size / 2],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: WAVE_PERIOD,
            times: [0, 0.08, 0.6, 1],
            repeat: Infinity,
            delay: i * (WAVE_PERIOD / 3),
            ease: "easeOut",
          }}
        />
      ))}
    </span>
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
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {!reduced ? (
        <motion.span
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f79009]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 2.6], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 1.1,
            repeatDelay: WAVE_PERIOD - 1.1,
            repeat: Infinity,
            delay,
            ease: "easeOut",
          }}
        />
      ) : null}
      <motion.span
        className="relative block"
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.3, 1], filter: ["brightness(1)", "brightness(1.7)", "brightness(1)"] }
        }
        transition={{
          duration: 0.9,
          repeatDelay: WAVE_PERIOD - 0.9,
          repeat: Infinity,
          delay,
          ease: "easeOut",
        }}
      >
        <Icon
          name="smartphone"
          size={15}
          filled
          color="#f79009"
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
      onClick={onClick}
      className={`pointer-events-auto absolute z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
        active ? "scale-110 bg-white/10 ring-2 ring-white/40" : ""
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </button>
  );
}

function SensorPin() {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${SENSOR.x}%`, top: `${SENSOR.y}%` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="sensor-glow grid h-7 w-7 place-content-center rounded-full bg-[#d92d20]/15">
        <Icon name="sensors" size={16} filled color="#ff5a4d" />
      </span>
      <AnimatePresence>
        {hover ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md border border-[#d92d20]/60 bg-bg/95 px-2.5 py-1.5"
          >
            <p className="readout whitespace-nowrap text-[9px] text-white/55">
              SENSOR_04 · NORSEMAN INN RD
            </p>
            <p className="font-display text-sm font-bold text-text">
              {SENSOR.reading}% fire likelihood
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
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
        : "#16b364";
  const badge =
    entity.kind === "fire"
      ? levelWord[entity.severity]
      : entity.kind === "broadcast"
        ? "URGENT"
        : entity.status.toUpperCase();

  // Anchor the card next to its marker and keep it inside the frame. The
  // interactive map only renders above the phone breakpoint, so there is always
  // room for the marker-anchored placement.
  const below = entity.y < 45;
  const toLeft = entity.x > 55;
  const tx = toLeft ? "calc(-100% - 14px)" : "14px";
  const ty = below ? "10px" : "calc(-100% - 10px)";

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{
        left: `${entity.x}%`,
        top: `${entity.y}%`,
        transform: `translate(${tx}, ${ty})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: below ? -8 : 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: below ? -6 : 6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-[264px] rounded-xl border border-white/10 bg-[#141416]/95 p-4 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide"
            style={{ backgroundColor: `${accent}26`, color: accent }}
          >
            {badge}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-6 w-6 place-content-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
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
          ) : (
            <>
              <Row label="Status" value={entity.status} valueColor="#16b364" />
              <Row label="Capacity" value={`${entity.capacity} people`} />
              <BarRow
                label="Occupancy"
                value={`${entity.occupancy} / ${entity.capacity}`}
                pct={Math.round((entity.occupancy / entity.capacity) * 100)}
                color="#16b364"
              />
              <Row label="Distance" value={entity.distance} />
              <Row label="Category" value={entity.category} />
            </>
          )}
        </div>
      </motion.div>
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
            <motion.span
              key={i}
              className="h-1.5 w-3 rounded-sm"
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.12 + i * 0.09, duration: 0.25 }}
              style={{
                backgroundColor: i < segs ? levelColor[level] : "#ffffff1f",
              }}
            />
          ))}
        </span>
        <span
          className="text-[10px] font-bold"
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
          transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
