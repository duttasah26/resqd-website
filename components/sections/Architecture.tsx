import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { FlowChart } from "@/components/animations/FlowChart";
import { howItWorks } from "@/lib/content";

export function Architecture() {
  return (
    <Section id="how-it-works" className="py-24 sm:py-32">
      <SectionHeading
        kicker="How it works"
        title={howItWorks.heading}
        sub={howItWorks.sub}
      />

      <div className="mt-14">
        <FlowChart />
      </div>

      <Reveal>
        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl">
              Proposed cloud infrastructure
            </h3>
            <span className="label rounded-full border border-high/50 bg-high/10 px-2.5 py-1 text-[11px] text-high">
              Work in progress
            </span>
          </div>
          <ScreenshotFrame
            name="cloud_infra.png"
            label="Proposed cloud architecture"
            aspect="aspect-[3/2]"
          />
          <p className="label mt-3 !tracking-[0.08em] text-muted/60">
            {howItWorks.diagramNote}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
