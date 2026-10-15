"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";

const SECTION_IDS = nav.links.map((l) => l.href.slice(1));

/*
  Top bar: logo, section links in page order, and the waitlist action. The
  link for the section on screen is marked (red rule + aria-current), so people
  always know where they are on a long page.

  On phones the bar keeps only the logo and the menu. The waitlist action lives
  in the hero, the menu, and the waitlist section; nothing is pinned to the
  bottom of the screen.
*/
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section is on screen: the one crossing a line 35% down the viewport.
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Back at the top, no section is current.
    const hero = document.getElementById("hero");
    const heroIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setCurrent(null);
      },
      { rootMargin: "-40% 0px 0px 0px" },
    );
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // While the menu is open, lock body scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 transition-colors duration-200 sm:px-8 ${
        solid ? "border-b border-border bg-bg" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Sections"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6"
      >
        <a
          href="#hero"
          aria-label={`${site.name}, back to top`}
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo-lockup-red.png"
            alt={site.name}
            width={1854}
            height={848}
            priority
            className="h-10 w-auto object-contain"
          />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.links.map((link) => {
            const active = current === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={`relative flex h-16 items-center px-3 text-sm transition-colors ${
                    active ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 bottom-0 h-0.5 bg-urgent transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={nav.cta.href}
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            {nav.cta.label}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2.5 grid h-11 w-11 place-content-center rounded text-text transition-colors hover:bg-white/[0.06] lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            key="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 lg:hidden"
          >
            <ul className="mx-auto w-full max-w-6xl divide-y divide-border border-b border-border">
              {nav.links.map((link) => {
                const active = current === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "true" : undefined}
                      className={`flex h-14 items-center justify-between font-display text-lg font-semibold ${
                        active ? "text-text" : "text-muted"
                      }`}
                    >
                      {link.label}
                      {active ? (
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full bg-urgent"
                        />
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="btn btn-primary btn-lg btn-block mx-auto mt-6 max-w-6xl"
            >
              {nav.cta.label}
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
