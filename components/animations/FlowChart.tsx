"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";

const STEPS = [
  {
    icon: "sensors",
    title: "A fire is detected",
    body: "Field sensors and citizen photo reports flag it early.",
  },
  {
    icon: "map",
    title: "It hits the live map",
    body: "The signal lands on the dispatcher's map as an incident.",
  },
  {
    icon: "verified_user",
    title: "A responder verifies",
    body: "Confirmed reports become tracked incidents in real time.",
  },
  {
    icon: "campaign",
    title: "The zone is alerted",
    body: "An evacuation broadcast reaches every phone in the radius.",
  },
  {
    icon: "route",
    title: "People get a way out",
    body: "Routing returns the safest path around the fire, not the shortest.",
  },
];

const WAVE = 1.8; // seconds for the pulse to travel one step

export function FlowChart() {
  const reduced = useReducedMotion();
  const cycle = WAVE * STEPS.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      {STEPS.map((step, i) => (
        <Fragment key={step.title}>
          {i > 0 ? (
            <motion.div
              className="mx-auto shrink-0 self-center lg:mx-0"
              animate={
                reduced
                  ? undefined
                  : { opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.1,
                      repeat: Infinity,
                      repeatDelay: cycle - 1.1,
                      delay: (i - 0.5) * WAVE,
                      ease: "easeInOut",
                    }
              }
            >
              <Icon
                name="chevron_right"
                size={22}
                className="rotate-90 text-urgent/70 lg:rotate-0"
              />
            </motion.div>
          ) : null}

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-surface/50 p-6 sm:p-7"
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-urgent/10 text-urgent"
              animate={
                reduced
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(217,45,32,0)",
                        "0 0 18px 2px rgba(217,45,32,0.55)",
                        "0 0 0 0 rgba(217,45,32,0)",
                      ],
                    }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: cycle - 1.2,
                      delay: i * WAVE,
                      ease: "easeInOut",
                    }
              }
            >
              <Icon name={step.icon} size={26} filled />
            </motion.div>
            <div>
              <p className="readout text-[10px] text-muted/50">Step {i + 1}</p>
              <h3 className="mt-1 font-display text-lg font-bold leading-tight text-text sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </motion.div>
        </Fragment>
      ))}
    </div>
  );
}
