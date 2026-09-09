import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { DashboardMock } from "@/components/dashboard/DashboardMock";
import { dashboard } from "@/lib/content";

export function DashboardShowcase() {
  return (
    <Section id="dashboard" className="py-24 sm:py-32">
      <SectionHeading
        kicker="The dashboard"
        title={dashboard.heading}
        sub={dashboard.sub}
      />

      <Reveal>
        <div className="mt-14">
          <DashboardMock />
        </div>
      </Reveal>
    </Section>
  );
}
