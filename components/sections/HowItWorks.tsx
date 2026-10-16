import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductStory } from "@/components/animations/ProductStory";
import { productStory } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={productStory.heading} sub={productStory.sub} />

      <div className="mt-12 sm:mt-14">
        <ProductStory />
      </div>
    </Section>
  );
}
