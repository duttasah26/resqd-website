"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { Lightbox } from "@/components/ui/Lightbox";
import { gallery } from "@/lib/content";

const SHOTS = [
  { name: "dashboard.png", label: "Dashboard / command view", span: "lg:col-span-2", aspect: "aspect-[2/1]" },
  { name: "map.png", label: "Dashboard / live map", span: "lg:col-span-2", aspect: "aspect-[2/1]" },
  { name: "sensors.png", label: "Sensors / ML monitoring", span: "lg:col-span-2", aspect: "aspect-[2/1]" },
  { name: "mobile_map_view.png", label: "Mobile / alert map", span: "", aspect: "aspect-[9/16]" },
  { name: "mobile_home_screen.png", label: "Mobile / home", span: "", aspect: "aspect-[9/16]" },
];

export function ScreenshotGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="gallery" className="py-24 sm:py-32">
      <SectionHeading kicker="Screens" title={gallery.heading} sub={gallery.sub} />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHOTS.map((shot, i) => (
          <Reveal key={shot.name} delay={i * 0.05} className={shot.span}>
            <ScreenshotFrame
              name={shot.name}
              label={shot.label}
              aspect={shot.aspect}
              onOpen={() => setOpen(i)}
            />
          </Reveal>
        ))}
      </div>

      <p className="label mt-4 text-muted/50">Click any screen to view it full size</p>

      <Lightbox
        images={SHOTS.map((s) => ({ src: `/screenshots/${s.name}`, label: s.label }))}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </Section>
  );
}
