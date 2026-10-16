import { Section, SectionHeading } from "@/components/ui/Section";
import { StatBlock } from "@/components/ui/StatBlock";
import { problem } from "@/lib/content";

export function Problem() {
  return (
    <Section id="problem" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={problem.heading} sub={problem.body} />

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {problem.stats.map((stat) => (
          <StatBlock key={stat.value} {...stat} />
        ))}
      </div>

      <p className="mt-14 max-w-2xl font-display text-xl leading-snug text-text sm:text-2xl">
        {problem.closing}
      </p>
    </Section>
  );
}
