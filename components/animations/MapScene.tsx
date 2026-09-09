"use client";

import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";

/* One shared map view for every animation, so the Mapbox static image is
   requested (and cached) exactly once for the whole page. */
export const MAP = {
  centerLon: -88.3,
  centerLat: 50.35,
  zoom: 5.8,
  width: 1000,
  height: 600,
};
export const MAP_W = MAP.width;
export const MAP_H = MAP.height;

// Public Mapbox token, supplied via env only (set it in Vercel project settings
// and .env.local for dev). Restrict it to your domains in the Mapbox dashboard.
// If it is missing the map scenes just render on the dark surface, no basemap.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MAP_IMG_URL = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/` +
    `${MAP.centerLon},${MAP.centerLat},${MAP.zoom}/${MAP.width}x${MAP.height}@2x` +
    `?access_token=${MAPBOX_TOKEN}&logo=false&attribution=false`
  : null;

const TILE = 512;

/** Web-Mercator projection matched to the static image above. */
export function project(lat: number, lon: number): { x: number; y: number } {
  const ws = TILE * 2 ** MAP.zoom;
  const px = ((lon + 180) / 360) * ws;
  const s = Math.sin((lat * Math.PI) / 180);
  const py = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * ws;
  const cs = Math.sin((MAP.centerLat * Math.PI) / 180);
  const cx = ((MAP.centerLon + 180) / 360) * ws;
  const cy = (0.5 - Math.log((1 + cs) / (1 - cs)) / (4 * Math.PI)) * ws;
  return { x: MAP.width / 2 + (px - cx), y: MAP.height / 2 + (py - cy) };
}

export interface Site {
  id: string;
  name: string;
  x: number;
  y: number;
}

/** The seven real sensor towns from CAPSTONE_HANDOFF.md. */
export const SITES: Site[] = [
  { id: "SENSOR_001", name: "Dryden", ...project(49.78, -92.83) },
  { id: "SENSOR_002", name: "Red Lake", ...project(51.02, -93.89) },
  { id: "SENSOR_003", name: "Sioux Lookout", ...project(50.11, -91.92) },
  { id: "SENSOR_004", name: "Thunder Bay", ...project(48.38, -89.25) },
  { id: "SENSOR_005", name: "Timmins", ...project(48.48, -81.33) },
  { id: "SENSOR_006", name: "Cochrane", ...project(49.35, -84.33) },
  { id: "SENSOR_007", name: "Pickle Lake", ...project(52.95, -90.42) },
];
export const siteByName = (n: string): Site =>
  SITES.find((s) => s.name === n) ?? SITES[0];

/** Sites that land comfortably inside the current map frame. */
export const visibleSites = (): Site[] =>
  SITES.filter(
    (s) => s.x > 50 && s.x < MAP_W - 50 && s.y > 50 && s.y < MAP_H - 50,
  );

export const pctX = (x: number) => `${(x / MAP_W) * 100}%`;
export const pctY = (y: number) => `${(y / MAP_H) * 100}%`;

/**
 * A card holding the dark Mapbox basemap with an animation layer on top.
 * `children` are positioned against a 1000x600 space (use pctX/pctY for HTML,
 * or a <svg viewBox="0 0 1000 600"> for lines and rings).
 */
export function MapScene({
  children,
  note,
}: {
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
      >
        {MAP_IMG_URL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={MAP_IMG_URL}
            alt="Dark map of Northern Ontario"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(1.5) saturate(1.15) contrast(1.05)" }}
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg/25" />
        {children}
        {MAP_IMG_URL ? (
          <span className="absolute bottom-1 right-2 text-[9px] text-white/35">
            © Mapbox © OpenStreetMap
          </span>
        ) : null}
      </div>

      {note ? (
        <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted/80">
          {note}
        </p>
      ) : null}
    </div>
  );
}

type MotionProps = Pick<
  ComponentProps<typeof motion.div>,
  "initial" | "animate" | "transition"
>;

/** Google-font icon marker positioned on the map; accepts motion props. */
export function MapMarker({
  x,
  y,
  name,
  color,
  size = 22,
  filled = true,
  style,
  initial,
  animate,
  transition,
}: {
  x: number;
  y: number;
  name: string;
  color: string;
  size?: number;
  filled?: boolean;
  style?: CSSProperties;
} & MotionProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pctX(x), top: pctY(y), ...style }}
    >
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
      >
        <Icon
          name={name}
          size={size}
          filled={filled}
          color={color}
          style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8))" }}
        />
      </motion.div>
    </div>
  );
}

/** Small pill overlaid on the map (used only for the safety score). */
export function MapTag({
  x,
  y,
  children,
  tone = "neutral",
}: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: "neutral" | "urgent" | "safe";
}) {
  const ring =
    tone === "urgent"
      ? "border-urgent/60 text-urgent"
      : tone === "safe"
        ? "border-safe/60 text-safe"
        : "border-white/20 text-white/80";
  return (
    <div
      className={`label absolute -translate-x-1/2 -translate-y-1/2 rounded-md border bg-bg/85 px-2 py-1 text-[10px] ${ring}`}
      style={{ left: pctX(x), top: pctY(y) }}
    >
      {children}
    </div>
  );
}

/** A circular zone (safe zone, coverage) drawn in the svg overlay space. */
export function ZoneCircle({
  x,
  y,
  r,
  color = "#16b364",
}: {
  x: number;
  y: number;
  r: number;
  color?: string;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={color}
      fillOpacity={0.1}
      stroke={color}
      strokeOpacity={0.55}
      strokeDasharray="5 4"
    />
  );
}

/** Expanding pulse rings, drawn in the svg overlay's coordinate space. */
export function PulseRings({
  x,
  y,
  r,
  color,
  count = 3,
  period = 3,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  count?: number;
  period?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeOpacity={0.5} />
    );
  }
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1], opacity: [0.7, 0] }}
          transition={{
            duration: period,
            repeat: Infinity,
            delay: (period / count) * i,
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </>
  );
}
