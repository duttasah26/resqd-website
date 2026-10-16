"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { howItWorks } from "@/lib/content";

/*
  Desktop version of the pipeline. The frame is pinned and centred while a
  line fills with scroll; the stage it has reached grows and its
  detail swaps in below. Mobile uses the plain FlowChart list instead.
*/

const STOPS = howItWorks.steps;
const N = STOPS.length;
const GROUPS = [
  { label: "Ingest", from: 0, to: 2 },
  { label: "Process", from: 2, to: 4 },
  { label: "Serve", from: 4, to: 7 },
];
// the first and last stop centres sit half a column in from each edge
const FIRST = ((0.5 / N) * 100).toFixed(3) + "%";

function Node({
  i,
  p,
  active,
  still,
}: {
  i: number;
  p: MotionValue<number>;
  active: number;
  still: boolean;
}) {
  const at = i / (N - 1);
  const reached = useTransform(p, [Math.max(at - 0.05, 0), at + 0.0001], [0, 1]);
  const bg = useTransform(reached, [0, 1], ["#0a0a0b", "#d92d20"]);
  return (
    <div className="relative flex flex-col items-center">
      <motion.span
        className="grid h-5 w-5 place-content-center rounded-full border border-line-strong"
        style={still ? { background: "#d92d20" } : { background: bg }}
        animate={{ scale: i === active ? 1.5 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <p
        className={`mt-4 text-center font-display text-[15px] font-bold leading-snug transition-colors duration-300 ${
          i === active ? "text-text" : "text-muted"
        }`}
      >
        {STOPS[i].label}
      </p>
      <p className="mt-1 text-center text-[13px] text-muted">{STOPS[i].tech}</p>
    </div>
  );
}

export function PipelineStory() {
  const reduced = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ["start 64px", "end end"],
  });
  useMotionValueEvent(p, "change", (v) => {
    const i = Math.round(Math.min(Math.max(v, 0), 1) * (N - 1));
    setActive((cur) => (cur === i ? cur : i));
  });

  return (
    <div
      ref={trackRef}
      className="hidden lg:block"
      style={{ height: `${N * 30}vh` }}
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center">
        {/* group labels */}
        <div className="grid grid-cols-7">
          {GROUPS.map((g) => (
            <p
              key={g.label}
              className="pb-5 text-[13px] font-medium text-muted"
              style={{
                gridColumn: `${g.from + 1} / ${g.to + 1}`,
                // start at the centre of the group's first stop, not its edge
                paddingLeft: `${100 / (2 * (g.to - g.from))}%`,
              }}
            >
              {g.label}
            </p>
          ))}
        </div>

        <div className="relative">
          {/* track and scroll-driven fill, between the first and last stop centres */}
          <div
            aria-hidden
            className="absolute top-[9px] h-0.5 bg-border"
            style={{ left: FIRST, right: FIRST }}
          />
          <motion.div
            aria-hidden
            className="absolute top-[9px] h-0.5 origin-left bg-urgent"
            style={{
              left: FIRST,
              right: FIRST,
              scaleX: reduced ? 1 : p,
            }}
          />

          <ol className="relative grid grid-cols-7">
            {STOPS.map((s, i) => (
              <li key={s.label}>
                <Node i={i} p={p} active={active} still={reduced} />
              </li>
            ))}
          </ol>
        </div>

        {/* the stage the line has reached */}
        <div className="mt-14 min-h-[8.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={STOPS[active].label}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -10 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                {STOPS[active].label}
              </h3>
              <p className="mt-1 text-sm text-muted">{STOPS[active].tech}</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {STOPS[active].detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
