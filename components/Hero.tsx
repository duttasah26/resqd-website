import { site } from "@/lib/content";
import { HeroMap } from "@/components/hero/HeroMap";

export function Hero() {
  const { hero } = site;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#1f1f1f] bg-cover bg-right px-5 pt-24 pb-16 sm:px-8"
      style={{ backgroundImage: "url(/background/map_bg.png)" }}
    >
      {/* keep the left text readable over the map image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1f1f1f] via-[#1f1f1f]/70 to-[#1f1f1f]/5" />
      {/* dissolve the hero into the next section's colour so the seam isn't abrupt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#0a0a0b]/60 to-[#0a0a0b]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <h1 className="font-display text-5xl font-bold leading-[1.03] tracking-tight text-text sm:text-6xl md:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {hero.sub}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={hero.primaryCta.href}
              className="inline-flex h-12 items-center justify-center rounded-full bg-urgent px-7 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 text-sm font-semibold text-text backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <HeroMap />
      </div>
    </section>
  );
}
