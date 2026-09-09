"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { nav, site } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 transition-colors duration-300 sm:px-8 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-5">
          <a href="#hero" aria-label={site.name} className="flex items-center">
            <Image
              data-navlogo
              src="/logo-lockup-red.png"
              alt={site.name}
              width={1854}
              height={848}
              priority
              className="h-10 w-auto -translate-x-[3px] -translate-y-[4px] object-contain sm:h-12"
            />
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <a
          href={nav.cta.href}
          className="rounded-full bg-urgent px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          {nav.cta.label}
        </a>
      </nav>
    </header>
  );
}
