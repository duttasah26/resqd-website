import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { useCases } from "@/lib/content";

export function UseCases() {
  return (
    <Section id="in-action" className="py-24 sm:py-32">
      <SectionHeading kicker="Use cases" title={useCases.heading} />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {useCases.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="h-full rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center justify-center rounded-lg border border-border bg-surface-2 w-11 h-11 text-urgent">
                <Icon name={item.icon} size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
