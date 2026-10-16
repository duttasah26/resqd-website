"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { features, type Feature } from "@/lib/features";
import { platform } from "@/lib/content";
import { PlatformMap } from "@/components/animations/PlatformMap";
import { LiveSync } from "@/components/animations/LiveSync";

/*
  Desktop: text and map are pinned together in one frame, centred in the
  viewport. Scrolling swaps the text and changes what the map is doing, and
  each step holds for a stretch of scroll instead of sliding past.
  Below lg: stacked blocks, each with its own map underneath.
*/

/* The map carries the first four features; the report-to-every-map handoff
   keeps its own phone, API and screens animation. */
function Visual({ index, still = false }: { index: number; still?: boolean }) {
  return features[index].anim === "live-sync" ? (
    <LiveSync still={still} />
  ) : (
    <PlatformMap step={index} still={still} />
  );
}

function Copy({ feature }: { feature: Feature }) {
  return (
    <div>
      <h3 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-text sm:text-4xl md:text-[2.75rem]">
        {feature.headline}
      </h3>
      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        {feature.body}
      </p>
      <ul className="mt-6 space-y-2.5">
        {feature.points.map((point) => (
          <li key={point} className="flex gap-3 text-sm text-text/90">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-urgent" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Features() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 64px", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = features.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    setActive((cur) => (cur === i ? cur : i));
  });

  return (
    <Section id="platform" className="py-28 sm:py-40 lg:py-48">
      <SectionHeading title={platform.heading} sub={platform.sub} />

      {/* Both layouts are in the markup and CSS picks one, so the page height
          is the same before and after hydration and #platform links and
          anchors below it land where they should. */}
      <div
        ref={trackRef}
        className="mt-16 hidden lg:block"
        style={{ height: `${features.length * 45}vh` }}
      >
        <div className="sticky top-16 grid h-[calc(100svh-4rem)] grid-cols-2 items-center gap-16">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={features[active].id}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -14 }}
                transition={{ duration: 0.3 }}
              >
                <Copy feature={features[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={features[active].anim === "live-sync" ? "sync" : "map"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Visual index={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-24 lg:hidden">
        {features.map((feature, i) => (
          <div key={feature.id}>
            <Copy feature={feature} />
            <div className="mt-8">
              <Visual index={i} still />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
