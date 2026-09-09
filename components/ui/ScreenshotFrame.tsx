"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface ScreenshotFrameProps {
  /** File placed in /public/screenshots, e.g. "dashboard.png". */
  name: string;
  label: string;
  /** Tailwind aspect-ratio utility. */
  aspect?: string;
  className?: string;
  /** When set, the frame becomes a button that opens the image full-size. */
  onOpen?: () => void;
}

/**
 * Shows /screenshots/<name> once it exists; until then it renders a labelled
 * placeholder so the layout is final and screen captures can be dropped in later.
 */
export function ScreenshotFrame({
  name,
  label,
  aspect = "aspect-[16/10]",
  className = "",
  onOpen,
}: ScreenshotFrameProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // If the request 404s before hydration, React never replays onError, so also
  // check the decoded state once on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  const clickable = Boolean(onOpen) && !missing;
  const Tag = clickable ? "button" : "div";

  return (
    <Tag
      {...(clickable ? { type: "button" as const, onClick: onOpen } : {})}
      className={`group relative block w-full overflow-hidden rounded-xl border border-border bg-surface ${aspect} ${
        clickable ? "cursor-zoom-in" : ""
      } ${className}`}
    >
      {!missing ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={`/screenshots/${name}`}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setMissing(true)}
          />
          {clickable ? (
            <span className="pointer-events-none absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="label text-white/90">{label}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                <Icon name="open_in_full" size={15} />
              </span>
            </span>
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 hairline-grid text-center">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            className="text-muted/50"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 15l4.5-4.5 4 4L15 9l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="px-4 font-mono text-xs uppercase tracking-widest text-muted/70">
            {label}
          </p>
          <p className="font-mono text-[10px] text-muted/40">
            /public/screenshots/{name}
          </p>
        </div>
      )}
    </Tag>
  );
}
