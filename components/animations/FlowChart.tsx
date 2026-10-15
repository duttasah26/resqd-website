"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { howItWorks } from "@/lib/content";

/*
  The real pipeline, as one line with seven stops. A single pulse travels the
  line at constant speed; each stop lights exactly when the pulse reaches it.
  Horizontal from lg, vertical below. Plays only while on screen.
*/

const STOPS = howItWorks.steps;
const GROUPS = [
  { label: "Ingest", from: 0, to: 2 },
  { label: "Process", from: 2, to: 4 },
  { label: "Serve", from: 4, to: 7 },
];

const TRAVEL = 4.2; // seconds for the pulse to cross all stops
const REST = 1.4; // pause before the next reading goes through

export function FlowChart() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const live = inView && !reduced;
  const n = STOPS.length;
  // Stops are evenly spaced (equal columns on desktop, 96px rows on mobile),
  // so stop i sits at i / (n - 1) of the line.
  const reach = (i: number) => (i / (n - 1)) * TRAVEL;

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
        {/* the line: vertical on mobile, horizontal on desktop */}
        <span
          aria-hidden
          className="absolute bottom-[84px] left-[7px] top-[11px] w-px bg-border lg:bottom-auto lg:left-[7px] lg:right-[calc(100%/7-7px)] lg:top-[7px] lg:h-px lg:w-auto"
        />
        {live ? (
          <>
            <motion.span
              aria-hidden
              className="absolute hidden h-[7px] w-[7px] rounded-full bg-urgent shadow-[0_0_0_4px_rgba(217,45,32,0.25)] lg:block"
              style={{ top: 4 }}
              initial={{ left: "0%" }}
              animate={{ left: `calc(${((n - 1) / n) * 100}% + 4px)` }}
              transition={{
                duration: TRAVEL,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: REST,
              }}
            />
            <motion.span
              aria-hidden
              className="absolute left-[4px] h-[7px] w-[7px] rounded-full bg-urgent shadow-[0_0_0_4px_rgba(217,45,32,0.25)] lg:hidden"
              initial={{ top: 8 }}
              animate={{ top: "calc(100% - 88px)" }}
              transition={{
                duration: TRAVEL,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: REST,
              }}
            />
          </>
        ) : null}

        {STOPS.map((s, i) => (
          <li
            key={s.label}
            className="relative h-24 pl-8 lg:h-auto lg:pl-0 lg:pr-5 lg:pt-8"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1 grid h-[15px] w-[15px] place-content-center rounded-full border border-line-strong bg-bg lg:top-0"
            >
              <motion.span
                className="h-[7px] w-[7px] rounded-full bg-urgent"
                initial={{ opacity: reduced ? 1 : 0.15 }}
                animate={
                  live
                    ? { opacity: [0.15, 1, 1, 0.15], scale: [1, 1.4, 1, 1] }
                    : { opacity: 1 }
                }
                transition={
                  live
                    ? {
                        duration: 1.2,
                        times: [0, 0.1, 0.5, 1],
                        delay: reach(i),
                        repeat: Infinity,
                        repeatDelay: TRAVEL + REST - 1.2,
                      }
                    : undefined
                }
              />
            </span>
            <p className="font-display text-[15px] font-bold leading-snug text-text lg:min-h-[2.75em]">
              {s.label}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {s.note}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
