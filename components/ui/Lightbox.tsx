"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";

export interface LightboxImage {
  src: string;
  label: string;
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onIndex((index + dir + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  // Keyboard: Escape closes, arrows page, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [open, onClose, go]);

  // Focus moves into the dialog on open and back to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && index !== null ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={dialogRef}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={images[index].label}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-content-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
          >
            <Icon name="close" size={20} />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-content-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 sm:left-5"
              >
                <Icon name="chevron_left" size={26} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-content-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 sm:right-5"
              >
                <Icon name="chevron_right" size={26} />
              </button>
            </>
          ) : null}

          <motion.figure
            key={index}
            className="m-0 flex max-h-full max-w-full flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].src}
              alt={images[index].label}
              className="max-h-[82vh] max-w-[92vw] rounded-lg border border-white/10 object-contain shadow-2xl"
            />
            <figcaption className="text-[13px] font-medium text-white/80">
              {images[index].label} · {index + 1} / {images.length}
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
