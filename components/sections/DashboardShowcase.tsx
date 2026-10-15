import { Section, SectionHeading } from "@/components/ui/Section";
import { DashboardMock } from "@/components/dashboard/DashboardMock";
import { dashboard } from "@/lib/content";

export function DashboardShowcase() {
  return (
    <Section id="dashboard" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={dashboard.heading} sub={dashboard.sub} />

      <div>
        <div className="mt-14">
          <DashboardMock />
        </div>
      </div>
    </Section>
  );
}
