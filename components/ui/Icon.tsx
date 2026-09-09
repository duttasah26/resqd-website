import type { CSSProperties } from "react";

interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. "local_fire_department". */
  name: string;
  className?: string;
  /** Pixel size; also drives the optical-size axis. */
  size?: number;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  color?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  className = "",
  size = 24,
  filled = false,
  weight = 400,
  color,
  style,
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        color,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
