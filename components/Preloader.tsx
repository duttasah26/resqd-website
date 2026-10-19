"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const RATIO = 1854 / 848; // logo-lockup-red.png aspect
const H = 112; // splash logo height in px
const W = Math.round(H * RATIO);

interface Coords {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  es: number;
}

export function Preloader() {
  const [show, setShow] = useState(true);
  const [coords, setCoords] = useState<Coords | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const navLogo = document.querySelector<HTMLElement>("[data-navlogo]");
      const nr = navLogo?.getBoundingClientRect();
      setCoords({
        sx: window.innerWidth / 2 - W / 2,
        sy: window.innerHeight / 2 - H / 2,
        ex: nr ? nr.left : 28,
        ey: nr ? nr.top : 18,
        es: nr ? nr.height / H : 0.42,
      });
    });
    const t = setTimeout(() => setShow(false), reduced ? 350 : 1650);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] bg-black"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.25 : 0.4, ease: "easeInOut" }}
        >
          {coords ? (
            <motion.div
              className="fixed left-0 top-0 origin-top-left"
              style={{ width: W, height: H, willChange: "transform" }}
              initial={{ opacity: 0, x: coords.sx, y: coords.sy, scale: 0.85 }}
              animate={
                reduced
                  ? { opacity: 1, x: coords.ex, y: coords.ey, scale: coords.es }
                  : {
                      opacity: [0, 1, 1, 1],
                      x: [coords.sx, coords.sx, coords.sx, coords.ex],
                      y: [coords.sy, coords.sy, coords.sy, coords.ey],
                      scale: [0.85, 1, 1, coords.es],
                    }
              }
              transition={
                reduced
                  ? { duration: 0.3 }
                  : {
                      duration: 1.4,
                      times: [0, 0.24, 0.44, 1],
                      ease: [0.65, 0, 0.32, 1],
                    }
              }
            >
              {/* plain img so the splash paints on the first frame */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-lockup-red.png"
                alt="ResQd"
                className="h-full w-full object-contain"
              />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
