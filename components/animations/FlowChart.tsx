"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { howItWorks } from "@/lib/content";

/*
  The real pipeline, as one line with seven stops. It is scroll-driven: the
  line fills and each stop lights as the reader scrolls past, so the reader
  sets the pace and nothing loops. Horizontal from lg, vertical below.
*/

const STOPS = howItWorks.steps;
const GROUPS = [
  { label: "Ingest", from: 0, to: 2 },
  { label: "Process", from: 2, to: 4 },
  { label: "Serve", from: 4, to: 7 },
];

function Dot({
  at,
  p,
  still,
}: {
  at: number;
  p: MotionValue<number>;
  still: boolean;
}) {
  const opacity = useTransform(p, [Math.max(at - 0.06, 0), at + 0.0001], [0.15, 1]);
  return (
    <motion.span
      className="h-[7px] w-[7px] rounded-full bg-urgent"
      style={still ? undefined : { opacity }}
    />
  );
}

export function FlowChart() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start 78%", "end 52%"],
  });
  const n = STOPS.length;

  return (
    <div ref={ref}>
      {/* group labels, desktop */}
      <div className="hidden grid-cols-7 lg:grid">
        {GROUPS.map((g) => (
          <p
            key={g.label}
            className="pb-4 text-[13px] font-medium text-muted"
            style={{ gridColumn: `${g.from + 1} / ${g.to + 1}` }}
          >
            {g.label}
          </p>
        ))}
      </div>

      <ol className="relative grid gap-0 lg:grid-cols-7">
        {/* the track: vertical on mobile, horizontal on desktop */}
        <span
          aria-hidden
          className="absolute bottom-[36px] left-[7px] top-[11px] w-px bg-border lg:bottom-auto lg:left-[7px] lg:right-[calc(100%/7-7px)] lg:top-[7px] lg:h-px lg:w-auto"
        />
        {/* the fill, driven by scroll */}
        <motion.span
          aria-hidden
          className="absolute bottom-[36px] left-[7px] top-[11px] w-px origin-top bg-urgent lg:hidden"
          style={reduced ? undefined : { scaleY: p }}
        />
        <motion.span
          aria-hidden
          className="absolute hidden origin-left bg-urgent lg:left-[7px] lg:right-[calc(100%/7-7px)] lg:top-[7px] lg:block lg:h-px"
          style={reduced ? undefined : { scaleX: p }}
        />

        {STOPS.map((s, i) => (
          <li
            key={s.label}
            className="relative h-12 pl-8 lg:h-auto lg:pl-0 lg:pr-5 lg:pt-8"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1 grid h-[15px] w-[15px] place-content-center rounded-full border border-line-strong bg-bg lg:top-0"
            >
              <Dot at={i / (n - 1)} p={p} still={reduced} />
            </span>
            <p className="font-display text-[15px] font-bold leading-snug text-text lg:min-h-[2.75em]">
              {s.label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
