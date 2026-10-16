import { Section, SectionHeading } from "@/components/ui/Section";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { FlowChart } from "@/components/animations/FlowChart";
import { PipelineStory } from "@/components/animations/PipelineStory";
import { SensorNetworkMap } from "@/components/sections/SensorNetworkMap";
import { StatBlock } from "@/components/ui/StatBlock";
import { howItWorks, systemFacts } from "@/lib/content";

export function Architecture() {
  return (
    <Section id="architecture" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={howItWorks.heading} sub={howItWorks.sub} />

      {/* desktop: pinned, packet-driven story; below lg: the plain list */}
      <div className="mt-14 lg:hidden">
        <FlowChart />
      </div>
      <div className="mt-10">
        <PipelineStory />
      </div>

      <div className="mt-24">
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl">
          {systemFacts.label}
        </h3>
        <p className="mt-2 text-sm text-muted">{systemFacts.note}</p>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <SensorNetworkMap />
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {systemFacts.items.map((f) => (
              <StatBlock key={f.unit} {...f} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h3 className="mb-6 font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl">
          Cloud infrastructure
        </h3>
        <ScreenshotFrame
          name="cloud_infra.png"
          label="Proposed cloud architecture"
          aspect="aspect-[3/2]"
          sizes="(min-width: 1200px) 1152px, 100vw"
        />
      </div>
    </Section>
  );
}
