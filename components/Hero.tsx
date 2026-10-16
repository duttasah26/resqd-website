import Image from "next/image";
import { site } from "@/lib/content";
import { HeroMap } from "@/components/hero/HeroMap";

export function Hero() {
  const { hero } = site;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#1f1f1f] px-5 pt-24 pb-8 sm:px-8 sm:pt-24 sm:pb-16"
    >
      {/* above the fold: preload it rather than wait for CSS to discover it */}
      <Image
        src="/background/map_bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* keep the left text readable over the map image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1f1f1f] via-[#1f1f1f]/70 to-[#1f1f1f]/5" />
      {/* dissolve the hero into the next section's colour so the seam isn't abrupt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#0a0a0b]/60 to-[#0a0a0b]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8">
        {/*
          On phones the icons sit at the top with the copy right below, the whole
          hero, through the secondary button, kept inside one screen at every
          phone size; on lg the two-column layout takes over.
        */}
        <div className="order-2 mt-5 lg:order-first lg:mt-0">
          <h1 className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-balance text-text sm:text-6xl sm:leading-[1.03] md:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-snug text-muted sm:mt-6 sm:text-lg sm:leading-relaxed">
            {hero.sub}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
            <a href={hero.primaryCta.href} className="btn btn-primary btn-lg">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-secondary btn-lg">
              {hero.secondaryCta.label}
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            In development and testing. Sensor data is simulated for now.
          </p>
        </div>

        <div className="order-1 lg:contents">
          <HeroMap />
        </div>
      </div>
    </section>
  );
}
