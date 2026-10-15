import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
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
      {/* first Tab stop: jump past the nav to the content */}
      <a
        href="#main"
        className="btn btn-primary btn-sm fixed left-4 top-3 z-[60] -translate-y-20 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main
        id="main"
        tabIndex={-1}
        className="flex w-full max-w-full flex-1 flex-col overflow-x-clip outline-none"
      >
        <Hero />
        <HowItWorks />
        <div className="border-t border-border" />
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
