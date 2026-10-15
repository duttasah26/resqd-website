import { Section, SectionHeading } from "@/components/ui/Section";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { FlowChart } from "@/components/animations/FlowChart";
import { howItWorks } from "@/lib/content";

export function Architecture() {
  return (
    <Section id="architecture" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={howItWorks.heading} sub={howItWorks.sub} />

      <div className="mt-14">
        <FlowChart />
      </div>

      <div>
        <div className="mt-20">
          <h3 className="mb-6 font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl">
            Proposed cloud infrastructure
          </h3>
          <ScreenshotFrame
            name="cloud_infra.png"
            label="Proposed cloud architecture"
            aspect="aspect-[3/2]"
            sizes="(min-width: 1200px) 1152px, 100vw"
          />
        </div>
      </div>
    </Section>
  );
}
