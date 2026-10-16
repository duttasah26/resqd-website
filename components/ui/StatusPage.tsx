import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/content";

/*
  Shared frame for the 404 and error pages: the same dark Red Lake basemap as
  the hero, one heading, one plain sentence, and a way back. No page chrome
  beyond the logo, because the home page's section links don't exist here.
*/
export function StatusPage({
  code,
  title,
  body,
  children,
}: {
  code: string;
  title: string;
  body: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1f1f1f] px-5 sm:px-8">
      <Image
        src="/background/map_bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1f1f1f] via-[#1f1f1f]/80 to-[#1f1f1f]/20" />

      <header className="relative mx-auto flex h-16 w-full max-w-6xl items-center">
        <Link href="/" aria-label={`${site.name} home`} className="flex items-center">
          <Image
            src="/logo-lockup-red.png"
            alt={site.name}
            width={1854}
            height={848}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </header>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center pb-24">
        <div className="max-w-xl">
          <p className="readout !text-[13px] text-muted">{code}</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[1.02] tracking-tight text-text sm:text-6xl">
            {title}
          </h1>
          <div className="mt-5 text-lg leading-relaxed text-muted">{body}</div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>
        </div>
      </div>
    </main>
  );
}
