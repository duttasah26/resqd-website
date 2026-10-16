"use client";

import { MapScene, MapMarker, pctX, pctY, SITES } from "@/components/animations/MapScene";
import { PALETTE } from "@/lib/palette";

/* The seven sensor towns on the same basemap the rest of the page uses. */
export function SensorNetworkMap() {
  return (
    <MapScene always>
      {SITES.filter(
        (s) => s.x > 30 && s.x < 970 && s.y > 30 && s.y < 570,
      ).map((s) => (
        <div key={s.id}>
          <MapMarker x={s.x} y={s.y} name="sensors" color={PALETTE.safe} size={18} />
          <span
            className="absolute hidden -translate-x-1/2 whitespace-nowrap rounded sm:block bg-bg/80 px-1.5 py-0.5 text-[10px] font-semibold text-white/85"
            style={{ left: pctX(s.x), top: `calc(${pctY(s.y)} + 12px)` }}
          >
            {s.name}
          </span>
        </div>
      ))}
    </MapScene>
  );
}
