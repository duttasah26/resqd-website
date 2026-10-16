"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { Lightbox } from "@/components/ui/Lightbox";
import { gallery } from "@/lib/content";

/*
  Gapless on every width.
  Desktop (2fr / 1fr / 1fr): the two wide console shots stack on the left,
  both phone shots run the full height of that stack beside them, and the live
  map closes the set at full width.
  Phones: wide shots full width, the two phone shots side by side.
*/
const SHOTS = [
  {
    name: "dashboard.png",
    label: "Dashboard / command view",
    cell: "col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1",
    aspect: "aspect-[2/1]",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    name: "sensors.png",
    label: "Sensors / ML monitoring",
    cell: "col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2",
    aspect: "aspect-[2/1]",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    name: "mobile_map_view.png",
    label: "Mobile / alert map",
    cell: "h-full lg:col-start-2 lg:row-start-1 lg:row-span-2",
    aspect: "aspect-[9/16] lg:aspect-auto lg:h-full",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    position: "top",
  },
  {
    name: "mobile_home_screen.png",
    label: "Mobile / home",
    cell: "h-full lg:col-start-3 lg:row-start-1 lg:row-span-2",
    aspect: "aspect-[9/16] lg:aspect-auto lg:h-full",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    position: "top",
  },
  {
    name: "map.png",
    label: "Dashboard / live map",
    cell: "col-span-2 lg:col-span-3",
    aspect: "aspect-[2/1] lg:aspect-[5/2]",
    sizes: "100vw",
  },
] as const;

export function ScreenshotGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="gallery" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading title={gallery.heading} sub={gallery.sub} />

      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        {SHOTS.map((shot, i) => (
          <div key={shot.name} className={shot.cell}>
            <ScreenshotFrame
              name={shot.name}
              label={shot.label}
              aspect={shot.aspect}
              sizes={shot.sizes}
              position={"position" in shot ? shot.position : undefined}
              onOpen={() => setOpen(i)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        images={SHOTS.map((s) => ({
          src: `/screenshots/${s.name}`,
          label: s.label,
        }))}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </Section>
  );
}
