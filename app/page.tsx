import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { UseCases } from "@/components/sections/UseCases";
import { DashboardShowcase } from "@/components/sections/DashboardShowcase";
import { ScreenshotGallery } from "@/components/sections/ScreenshotGallery";
import { Waitlist } from "@/components/sections/Waitlist";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Problem />
        <div className="border-t border-border" />
        <Features />
        <div className="border-t border-border" />
        <Architecture />
        <div className="border-t border-border" />
        <UseCases />
        <div className="border-t border-border" />
        <DashboardShowcase />
        <ScreenshotGallery />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
