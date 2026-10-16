/*
  The brand colors for code that needs a literal value: SVG attributes, motion
  keyframes, and `${color}26`-style alpha suffixes. These mirror the CSS tokens
  in app/globals.css (--urgent, --high, --medium, --safe); change both
  together. In class names, use the token utilities (bg-urgent, text-safe).
*/
export const PALETTE = {
  urgent: "#d92d20",
  high: "#f79009",
  medium: "#fdb022",
  safe: "#16b364",
} as const;
