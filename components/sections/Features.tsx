import { Section, SectionHeading } from "@/components/ui/Section";
import { features } from "@/lib/features";
import { platform } from "@/lib/content";
import { FEATURE_ANIMATIONS } from "@/components/animations";

export function Features() {
  return (
    <Section id="platform" className="py-28 sm:py-40 lg:py-48">
      <SectionHeading title={platform.heading} sub={platform.sub} />

      <div className="mt-24 space-y-32 sm:mt-28 sm:space-y-48">
        {features.map((feature, i) => {
          const Anim = FEATURE_ANIMATIONS[feature.anim];
          const flip = i % 2 === 1;

          return (
            <div
              key={feature.id}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div className={flip ? "lg:order-2" : ""}>
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

              <div className={flip ? "lg:order-1" : ""}>
                <Anim />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
