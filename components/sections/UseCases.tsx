import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { useCases } from "@/lib/content";

/* Three scenarios as ruled entries, not boxed icon cards. */
export function UseCases() {
  return (
    <Section id="in-action" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={useCases.heading} />

      <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {useCases.items.map((item) => (
          <li key={item.title} className="border-t border-border pt-6">
            <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-text">
              <Icon
                name={item.icon}
                size={20}
                filled
                className="text-urgent-text"
              />
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
