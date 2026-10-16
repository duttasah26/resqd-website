import type { CSSProperties } from "react";
// Direct per-icon imports: the package entry re-exports ~1,500 icons.
import { ArrowsOut } from "@phosphor-icons/react/dist/ssr/ArrowsOut";
import { ArrowsSplit } from "@phosphor-icons/react/dist/ssr/ArrowsSplit";
import { Broadcast } from "@phosphor-icons/react/dist/ssr/Broadcast";
import { Camera } from "@phosphor-icons/react/dist/ssr/Camera";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CellSignalFull } from "@phosphor-icons/react/dist/ssr/CellSignalFull";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { DeviceMobile } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { Fire } from "@phosphor-icons/react/dist/ssr/Fire";
import { HardDrives } from "@phosphor-icons/react/dist/ssr/HardDrives";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { List } from "@phosphor-icons/react/dist/ssr/List";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { MapTrifold } from "@phosphor-icons/react/dist/ssr/MapTrifold";
import { Megaphone } from "@phosphor-icons/react/dist/ssr/Megaphone";
import { Monitor } from "@phosphor-icons/react/dist/ssr/Monitor";
import { NavigationArrow } from "@phosphor-icons/react/dist/ssr/NavigationArrow";
import { Path } from "@phosphor-icons/react/dist/ssr/Path";
import { Pause } from "@phosphor-icons/react/dist/ssr/Pause";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { Shield } from "@phosphor-icons/react/dist/ssr/Shield";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { ShieldPlus } from "@phosphor-icons/react/dist/ssr/ShieldPlus";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/*
  One icon set across the site: Phosphor, regular weight. Call sites keep the
  old Material Symbols names so content and animation data don't change.
*/
const ICONS: Record<string, PhosphorIcon> = {
  local_fire_department: Fire,
  health_and_safety: ShieldPlus,
  sensors: Broadcast,
  campaign: Megaphone,
  photo_camera: Camera,
  smartphone: DeviceMobile,
  warning: Warning,
  close: X,
  menu: List,
  chevron_left: CaretLeft,
  chevron_right: CaretRight,
  check: Check,
  check_circle: CheckCircle,
  alt_route: ArrowsSplit,
  route: Path,
  verified_user: ShieldCheck,
  shield: Shield,
  signal_cellular_alt: CellSignalFull,
  open_in_full: ArrowsOut,
  map: MapTrifold,
  home: House,
  dns: HardDrives,
  desktop_windows: Monitor,
  play: Play,
  pause: Pause,
  pin: MapPin,
  navigate: NavigationArrow,
};

interface IconProps {
  /** Icon key, e.g. "local_fire_department". See ICONS above. */
  name: string;
  className?: string;
  /** Pixel size. */
  size?: number;
  filled?: boolean;
  color?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  className = "",
  size = 24,
  filled = false,
  color,
  style,
}: IconProps) {
  const Glyph = ICONS[name];
  if (!Glyph) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon: no mapping for "${name}"`);
    }
    return null;
  }
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      size={size}
      color={color}
      weight={filled ? "fill" : "regular"}
      className={`inline-block shrink-0 select-none ${className}`}
      style={style}
    />
  );
}
